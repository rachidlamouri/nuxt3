<script setup lang="ts">
useHead({
  title: useRoute().meta.title ? `ACS | ${useRoute().meta.title}` : '',
  meta: [
    {
      name: 'description',
      content: useRoute().meta.description ? `${useRoute().meta.description}` : '',
    },
    {
      name: 'robots',
      content: useRoute().meta.robots ? `${useRoute().meta.robots}` : '',
    },
    { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
  ],
  bodyAttrs: {
    class: 'test',
  },
})
</script>

<template>
  <div class="admin" id="admin-container">
    <SkipLink />

    <!-- <AdminHeader /> -->
    <header class="px-l py-s">
      <Nuxt-link :to="{ name: 'index' }" aria-label="Aviation Component Solutions">
        <img class="w-auto h-4" src="/images/logo-color.svg" alt="ACS Logo Home Page" />
      </Nuxt-link>
    </header>
    <main class="flex-1 flex" id="main" tabindex="-1">
      <AdminSidebar />
      <div class="flex-1">
        <slot />
      </div>
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<style lang="scss" scoped>
#admin-container {
  // min-height: 100vh;
  display: flex;
  // flex-direction: column;
}
</style>
