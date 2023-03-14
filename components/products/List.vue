<script setup lang="ts">
import { type PropType } from 'vue'
import { IProduct } from '~/utils/schema'

const props = defineProps({
  products: {
    type: Array as PropType<Array<IProduct>>,
    required: true,
  },
})
</script>

<template>
  <div class="products-list">
    <ul class="gap-s" role="list">
      <ProductsCard :product="product" v-for="product in products" :key="product.acsPartNumber" />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/scss/_grid.scss';

.products-list {
  border: 1px sild red;

  ul {
    @include grid-6(1200, 800, 600, 400);
    li {
      overflow: hidden;
      .image {
        order: -1;
        transform: scale(1.05);
      }
    }
  }
}
</style>
