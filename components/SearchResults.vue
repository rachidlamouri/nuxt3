<script setup lang="ts">
defineProps({
  showSearchModal: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['getProduct', 'searchModalClosed'])

const searchText = ref()
const searchResults = ref()

const timeout = ref()

const searchProducts = async (searchText: string) => {
  console.log(searchText)
  searchResults.value = []
  const { data, pending, error } = await useFetch('/api/v1/products/search', {
    method: 'POST',
    body: { searchText },
  })
  if (error.value) {
    console.log(error.value)
    console.log('ERROR', error.value && error.value.data ? error.value.data : '')
  }

  if (data.value && data.value.length) searchResults.value = data.value
  console.log(searchResults.value)
}

watch(
  searchText,
  async (currentVal, oldValue) => {
    clearTimeout(timeout.value)
    // if (props.duration != 0) {
    // if (props.show) {
    searchResults.value = []
    timeout.value = setTimeout(() => {
      if (searchText.value.length > 3) searchProducts(currentVal)
    }, 300)
  },
  { deep: true }
)
</script>

<template>
  <div class="flow-s">
    <input
      type="search"
      list="ice-cream-flavors"
      minlength="3"
      placeholder="Search products"
      aria-label="Search Products"
      v-model="searchText"
    />
    <!-- <datalist id="ice-cream-flavors">
      <option value="A300"></option>
      <option value="A320"></option>
      <option value="Vickers"></option>
      <option value="Honeywell"></option>
      <option value="Liner"></option>
      <option value="Lube"></option>
      <option value="Pump"></option>
    </datalist> -->
    <div class="search-results">
      <ul class="flex flex-col" role="list">
        <li class="b-red" v-for="product in searchResults">
          <div class="flex justify-between">
            <div>
              <button @click="$emit('getProduct', product.slug)">
                <h2 class="text-0 font-semi-bold">{{ product.acsPartNumber }}</h2>
              </button>
            </div>
            <div class="image">
              <img
                :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/products/${product.media[0].name}.jpg`"
                :alt="`ACS ${product.media && product.media.length} Product Image`"
                v-if="product.media && product.media.length"
              />
              <img src="/images/placeholder.png" alt="Image Placeholder" v-else />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button @click="$emit('searchModalClosed')">Close</button>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 5rem;
}

input {
  &:invalid {
    color: red;
  }
}
</style>
