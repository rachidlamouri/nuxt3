<script lang="ts" setup>
const emit = defineEmits(['cartModalClosed'])

const shopNow = () => {
  navigateTo({ path: 'products' })
  emit('cartModalClosed')
}
</script>

<template>
  <div class="cart-empty | flow-2xs p-s">
    <p class="text-center">You have no items in your shopping bag</p>
    <button class="btn btn-primary cart" @click="shopNow">Shop</button>
  </div>
</template>

<style lang="scss" scoped></style>
