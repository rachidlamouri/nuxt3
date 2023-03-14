<script setup lang="ts">
import { type PropType } from 'vue'
import { IProduct } from '~/utils/types'
const props = defineProps({
  product: {
    // type: Object as PropType<IProduct>,
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div>
    <p class="text--1" v-if="!product.tbq">${{ (product.price / 100).toFixed(2) }}</p>
    <p class="text--2" v-else>To Be Quoted</p>
  </div>
</template>

<style lang="scss" scoped></style>
