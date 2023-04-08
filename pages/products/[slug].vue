<script lang="ts" setup></script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Product Details</h1>
      </template>
    </Hero>
    <div class="product-details">
      <CommerceProductDetails :slug="String($route.params.slug)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
