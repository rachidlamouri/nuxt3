<script lang="ts" setup>
const burgerVisible = ref()
const burgerActive = ref()
const emit = defineEmits(['burgerVisibilityChanged', 'burgerStateChanged'])

const toggleMobileNav = (windowWidth: any, navBreakPoint: any) => {
  burgerActive.value = false
  burgerVisible.value = windowWidth < Number(navBreakPoint) ? true : false
  emit('burgerVisibilityChanged', burgerVisible.value)
  emit('burgerStateChanged', burgerActive.value)
}

onMounted(() => {
  toggleMobileNav(
    document.documentElement.clientWidth,
    window.getComputedStyle(document.body).getPropertyValue('--nav-breakpoint')
  )
  window.addEventListener('resize', () => {
    toggleMobileNav(
      document.documentElement.clientWidth,
      window.getComputedStyle(document.body).getPropertyValue('--nav-breakpoint')
    )
  })
})
</script>

<template>
  <transition name="burger">
    <button
      class="burger"
      type="button"
      v-if="burgerVisible"
      :aria-expanded="burgerActive"
      :aria-label="burgerActive ? 'Close admin sidebar' : 'Open admin sidebar'"
      @click="
        () => {
          burgerActive = !burgerActive
          $emit('burgerStateChanged', burgerActive)
        }
      "
    >
      <span class="burger-bar"></span>
      <span class="visually-hidden">Main Menu</span>
    </button>
  </transition>
</template>

<style lang="scss" scoped></style>
