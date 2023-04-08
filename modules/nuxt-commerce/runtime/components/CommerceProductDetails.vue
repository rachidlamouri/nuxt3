<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { IProduct } from '~/utils/schema'
const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const pageTitle = ref(`Product`)

const config = useRuntimeConfig()

const route = useRoute()

const loading = ref()
const product = ref()
const addingToCart = ref()

const { cart, addToCart, saveCart } = useCartStore()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()

const itemQty = ref(1)
const addedItems = ref()

const showAlert = ref(false)

const productParams = computed(() => {
  return {
    match: `slug=${props.slug}`,
    project:
      'acsPartNumber, slug, description, price, media, tbq, oem, oemPartNumber, eligibilities, nextHigherAssemblies',
  }
})

// const fetchProducts = async () => {
// const headers = useRequestHeaders(['cookie']) as HeadersInit
const { data, error } = await useCsrfFetch(`products`, {
  baseURL: config.apiUrl,
  method: 'GET',
  params: productParams.value,
})
console.log(data.value)
product.value = data.value && Array.isArray(data.value) ? data.value[0] : {}
// if (error.value) console.log(error.value.data)
if (error.value) appErrorMsg.value = error.value.statusMessage || ''

const { data: relatedProducts, error: relatedErrors } = await useCsrfFetch(`products`, {
  baseURL: config.apiUrl,
  method: 'GET',
  params: {
    match: ``,
    project: 'acsPartNumber, slug, price, media, tbq, oem, oemPartNumber',
    page: 0,
    limit: 3,
  },
})
console.log(relatedProducts.value)
if (error.value) appErrorMsg.value = error.value.statusMessage || ''
// console.log(data.value)
// fetchedProducts.value = data.value
// products.value = products.value ? products.value.concat(fetchedProducts.value) : fetchedProducts.value
// products.value = [products.value[0]]
// }

// const { data, error } = await useFetch(`products/list`, {
//   method: 'GET',
//   baseURL: config.apiUrl,
//   params: productParams.value,
// })

// if (error.value) throw createError(error.value)
// if (!data.value) throw createError("can't find data")
// console.log('Products', data.value)
// product.value = data.value && Array.isArray(data.value) && data.value.length ? data.value[0] : []

// const { data: relatedProducts, error: relatedErrors } = await useFetch(`products/fetchrelated`, {
//   method: 'GET',
//   baseURL: config.apiUrl,
//   params: { slug: route.params.slug },
// })

// if (error.value) throw createError(error.value)
// if (!data.value) throw createError("can't find data")
// console.log('Related', data.value)

const getItemQuantity = () => {
  console.log('C', cart)
}

const someErrorLogger = () => {
  console.log('XXXXXXX')
}

const incDec = (product: any, action: string) => {
  // addRemoveItem(product, action)
}

const addItemToCart = async () => {
  addingToCart.value = true
  addToCart(product.value, itemQty.value)
  if (await saveCart()) useToast().success(`${itemQty.value} ${product.value.acsPartNumber}  added to your cart`)
  itemQty.value = 1
  addingToCart.value = false
}
</script>

<template>
  <div class="product-details">
    <div class="container flow bg-white py-xl">
      <ErrorMsg />
      <div class="" v-if="!loading">
        <div class="flex gap-l" v-if="product">
          <div class="image | max-w-14">
            <img
              :src="`${config.doSpaceEndpoint}/products/${product.media[0].name}.jpg`"
              :alt="`ACS ${product.media[0].name} Product Image`"
              v-if="product.media && product.media.length"
            />
            <img src="/images/placeholder.png" alt="Image Placeholder" v-else />
          </div>
          <div class="flow-s">
            <!-- <div> -->
            <h3 class="text-primary-20 font-bold">{{ product.acsPartNumber }}</h3>
            <p class="text--1 font-bold">{{ product.oem }} part number {{ product.oemPartNumber }}</p>
            <p class="mt-2xs">${{ (product.price / 100).toFixed(2) }}</p>

            <p>{{ product.description }}</p>
            <div class="flex items-center gap-s">
              <div class="flex items-center">
                <button
                  class="w-7 h-6 p-0 border border-neutral-80 text-1 cursor-pointer"
                  @click="
                    () => {
                      if (itemQty > 1) itemQty--
                    }
                  "
                >
                  -
                </button>
                <input class="w-7 h-6 border-y border-neutral-80 text-center" type="text" v-model="itemQty" />
                <button class="w-7 h-6 p-0 border border-neutral-80 text-1 cursor-pointer" @click="itemQty++">+</button>
              </div>
              <button class="btn btn-primary" @click="addItemToCart">Add To Cart</button>
            </div>

            <div v-if="product.eligibilities.length">
              <ul class="flex items-center gap-s" role="list">
                <span class="text--1 font-bold"> Eligibility:</span>
                <div class="flex flex-wrap gap-x-2xs gap-y-5xs text--1">
                  <li v-for="(eligibility, i) in product.eligibilities" :key="eligibility._id">
                    {{ eligibility.name }}
                  </li>
                </div>
              </ul>
            </div>
            <div v-if="product.nextHigherAssemblies.length">
              <ul class="flex items-center gap-s" role="list">
                <span class="text--1 font-bold"> Next Higher Assembly:</span>
                <div class="flex flex-wrap gap-x-2xs gap-y-5xs">
                  <li v-for="(nextHigherAssembly, i) in product.nextHigherAssemblies" :key="nextHigherAssembly._id">
                    {{ nextHigherAssembly.name }}
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div v-else>No Products</div>
      </div>
      <div v-else>... loading</div>
      <div v-if="relatedProducts && (relatedProducts as Array<IProduct>).length">
        <h2>Not Related Products</h2>
        <CommerceProductList :products="(relatedProducts  as Array<IProduct>)" />
      </div>
      <div v-else>... loading</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
