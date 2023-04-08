<script lang="ts" setup>
const { cartTotal } = useCartStore()
</script>

<template>
  <div class="cart-total | flex flex-col gap-xs font-bold tracking-3 mt-l">
    <div class="flex justify-between items-center">
      <p class="uppercase">Total</p>
      <p class="text-accent-60">${{ (cartTotal() / 100).toFixed(2) }}</p>
    </div>
  </div>
</template>

<style lang="" scoped></style>
