<script setup lang="ts">
import { type PropType } from 'vue'
import { useToast } from 'vue-toastification'

// import { useCartStore } from '~~/stores/useCartStorexxexx'
import { IProduct } from '~/utils/schema'
const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    required: true,
  },
})

const { addToCart, saveCart } = useCartStore()
const addingToCart = ref()

const addItemToCart = async () => {
  addingToCart.value = true
  addToCart(props.product)
  if (await saveCart()) useToast().success(`1 ${props.product.acsPartNumber} added to your cart`)
  addingToCart.value = false
}
</script>

<template>
  <li class="card | shadow-md">
    <div class="image">
      <img
        class=""
        :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/products/${product.media[0].name}.jpg`"
        :alt="`ACS ${product.media[0].name} Product Image`"
        v-if="product.media && product.media.length"
      />
      <img src="/images/placeholder.png" alt="Image Placeholder" v-else />
    </div>
    <div class="title-price">
      <p class="">{{ product.acsPartNumber }}</p>
      <ProductsPrice :product="product" />
    </div>
    <div class="actions">
      <button class="btn btn-product" @click="addItemToCart" v-if="!addingToCart">
        <Icon class="" name="mdi:cart-outline" />
        <span class="flex-1">Add To Cart</span>
      </button>
      <Spinner class="spinner" v-else />
      <NuxtLink class="btn btn-product" :to="{ name: 'products-slug', params: { slug: product.slug } }">
        <Icon class="" name="mdi:format-list-bulleted" />
        <span class="">Details</span>
      </NuxtLink>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding-block-end: var(--space-xs);
  // max-width: 16rem;

  .title-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: var(--space-xs);

    p {
      font-size: var(--font-size--1);
      color: var(--color-primary-10);
      font-weight: bold;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: var(--space-xs);
  }

  .image {
    img {
      transform: scale(1.05);
    }
  }

  .spinner {
    width: 1rem;
    height: 1rem;
  }
}
</style>
