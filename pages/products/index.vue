<script lang="ts" setup>
// import { IProduct } from '~/utils/types'
definePageMeta({
  title: 'Products',
  description: 'ACS Products',
  // auth: true,
  // layout: 'home',
  // middleware: 'auth',
})

// definePageMeta({ auth: false })

// const { fetchAll } = useHttp()
const config = useRuntimeConfig()

const containerRef = ref()
const products = ref()
const fetchedProducts = ref()
const loading = ref()

const page = ref(0)
const perPage = 24
const productSort = ref()

const flag = ref()

const sort = reactive({
  field: 'acsPartNumber',
  order: '',
})
const sortOptions = [
  { value: 'acsPartNumber', text: 'ACS Part Number' },
  { value: 'eom', text: 'OEM' },
  { value: 'eomPartNumber', text: 'OEM Part Number' },
  { value: 'price', text: 'price' },
]

const productParams = computed(() => {
  return {
    match: 'price[gt]=20000',
    page: page.value,
    limit: perPage,
    project: 'acsPartNumber, slug, price, media, tbq, oem, oemPartNumber',
    sort: `price=asc, acsPartNUmber=dsc`,
  }
})

const fetchProducts = async () => {
  const headers = useRequestHeaders(['cookie']) as HeadersInit
  const { data, error } = await useFetch(`products/list`, {
    method: 'GET',
    baseURL: config.apiUrl,
    params: productParams,
    headers: { ...headers, sessionAuthorization: 'jwtsession' },
  })
  if (error.value) throw createError(error.value)
  // console.log(data.value)
  fetchedProducts.value = data.value
  products.value = products.value ? products.value.concat(fetchedProducts.value) : fetchedProducts.value
  // products.value = [products.value[0]]
}

onMounted(() => {
  const options = { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' }
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        page.value = page.value + 1
        await fetchProducts()
      }
    })
  }, options)
  if (containerRef.value) observer.observe(containerRef.value)
})

const sortProducts = async (sortOption: string) => {
  console.log(sortOption)
  page.value = 0
  products.value = []
  switch (sortOption) {
    case 'price-hi-to-low':
      sort.field = 'price'
      sort.order = '-'
      break

    case 'price-low-to-hi':
      sort.field = 'price'
      sort.order = ''
      break

    case 'oem-asc':
      sort.field = 'oem'
      sort.order = ''
      break

    case 'oem-desc':
      sort.field = 'oem'
      sort.order = '-'
      break

    default:
      break
  }
}

await fetchProducts()
</script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Our Products</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <form class="shadow-sm">
          <ErrorMsg />
          <FormsBaseSelect
            label="Sorting"
            id="default-sorting"
            v-model="productSort"
            :selectOptions="[
              { value: 'default-sorting', text: 'Default Sorting' },
              { value: 'price-hi-to-low', text: 'Price High To Low' },
              { value: 'price-low-to-hi', text: 'Price Low To High' },
              { value: 'oem-desc', text: 'OEM Descending' },
              { value: 'oem-asc', text: 'OEM Ascending' },
            ]"
            nullOption="Choose an option"
            @update:modelValue="sortProducts"
          />
        </form>
        <div v-if="products && products.length">
          <ProductsList :products="products" />
        </div>
        <div v-else>
          <p>No Products</p>
        </div>
        <div
          class="spinner | place-center"
          ref="containerRef"
          v-if="fetchedProducts && fetchedProducts.length === perPage"
        >
          <Spinner />
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped></style>
