<script setup lang="ts">
defineProps({
  bgImage: {
    type: String,
  },
})
</script>

<template>
  <article :style="{ backgroundImage: `url('${bgImage}')` }">
    <div class="container flow flex flex-col items-start">
      <header>
        <span class="uppercase text--1 tracking-9 text-accent-70 font-bold"> <slot name="panorama" /></span>
        <slot name="heading" />
      </header>
      <slot />
      <slot name="footer" />
    </div>
  </article>
</template>

<style lang="scss" scoped></style>
