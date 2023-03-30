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
const headerRef = ref()
const mainRef = ref()
const scrolled = ref()
const headerWidth = ref()
const resized = ref()

const config = useRuntimeConfig()
const { authUser, isAuthenticated } = useAuthStore()

const { data, pending, error, refresh } = await useCsrfFetch('session', {
  baseURL: config.apiUrl,
  method: 'GET',
  // body: { ...formInputs },
})
// console.log(data.value)
authUser.value = { ...data.value }

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(async (entry) => {
      headerWidth.value = +entry.contentRect.width
      if (headerRef.value) {
        if (+entry.contentRect.width < +window.getComputedStyle(document.body).getPropertyValue('--nav-breakpoint')) {
          headerRef.value.classList.add('resized')
          resized.value = true
        } else {
          headerRef.value.classList.remove('resized')
          resized.value = false
        }
      }
    })
  })
  if (headerRef.value) resizeObserver.observe(headerRef.value)

  const options = { root: null, threshold: 0, rootMargin: '10px 0px 0px 0px' }
  const mainObserver = new IntersectionObserver((entries, mainObserver) => {
    entries.forEach(async (entry) => {
      if (headerRef.value) {
        if (!entry.isIntersecting) {
          headerRef.value.classList.add('scrolled')
          scrolled.value = true
        } else {
          headerRef.value.classList.remove('scrolled')
          scrolled.value = false
        }
      }
    })
  }, options)
  if (mainRef.value) mainObserver.observe(mainRef.value)
})
</script>

<template>
  <div class="" id="main-container">
    <header class="main-header" :class="{ scrolled }" ref="headerRef">
      <Header :scrolled="scrolled" :headerWidth="headerWidth" :resized="resized" />
    </header>
    <main class="" id="main" tabindex="-1">
      <div class="observer" ref="mainRef"></div>

      <slot />
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<style lang="scss" scoped></style>
