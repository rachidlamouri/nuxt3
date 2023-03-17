<script lang="ts" setup></script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Contact</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <ContactForm />
      </div>
    </article>
  </div>
</template>

<style labg="scss" scoped></style>
