<script setup lang="ts">
const mobileHeaderAttr = ref()
const burgerVisible = ref(true)
const burgerToggleActive = ref(false)

const toggleMobileNav = (windowWidth: any, navBreakPoint: any) => {
  // burgerToggleActive.value = false // Collapse nav menu
  // if (windowWidth < Number(navBreakPoint)) {
  burgerVisible.value = windowWidth < Number(navBreakPoint) ? true : false // Show burger
  // mobileHeaderAttr.value = true // Set data-mobilenav attr to true
  // } else {
  // burgerVisible.value = false // Hide byeger
  // mobileHeaderAttr.value = false // Set data-mobilenav attr to false
  // }
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

const toggleMobileNavigation = () => {
  burgerToggleActive.value = !burgerToggleActive.value

  // $emit('toggleMobileNavigation')
}
</script>

<template>
  <header class="b-green" :data-mobilenav="mobileHeaderAttr">
    <SkipLink />
    <div class="">
      <div class="branding">
        <Nuxt-link :to="{ name: 'index' }" aria-label="Aviation Component Solutions">
          <img class="w-auto h-6" src="/images/logo-color.svg" alt="ACS Logo Home Page" />
        </Nuxt-link>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
// $burger-bar-position: 7px;

// .burger-toggle {
//   border: 1px solid blue;
//   height: 2.2rem;
//   width: 2.2rem;
//   position: fixed;
//   top: var(--space-s, 1rem);
//   right: var(--space-s, 1rem);
//   // z-index: 1;
//   .burger-bar::before,
//   .burger-bar::after {
//     content: '';
//     position: absolute;
//   }

//   .burger-bar,
//   .burger-bar::before,
//   .burger-bar::after {
//     display: block;
//     width: 24px;
//     height: 3px;
//     background-color: var(--color-primary-10, #444);
//     transition: transform 250ms ease-in-out;
//   }

//   .burger-bar::before {
//     top: $burger-bar-position;
//   }

//   .burger-bar::after {
//     bottom: $burger-bar-position;
//   }

//   &[data-enabled] {
//     // position: absolute;
//     // top: var(--space-s, 1rem);
//     // left: var(--space-s, 1rem);
//     // z-index: 1;
//   }

//   &[data-enabled='false'] {
//     // visibility: hidden;
//     // opacity: 0;
//   }

//   &[data-enabled='true'] {
//     // visibility: visible;
//     // opacity: 1;
//   }

//   &[aria-expanded='true'] {
//     // top: 1.5rem;
//     // left: 90%;
//     & .burger-bar {
//       background: transparent;
//       border-color: transparent;
//       transform: rotate(180deg);
//     }

//     & .burger-bar:before {
//       transform: translateY(-$burger-bar-position) rotate(135deg);
//     }

//     & .burger-bar:after {
//       transform: translateY($burger-bar-position) rotate(45deg);
//     }
//   }

//   // &[data-enabled='true'] + nav {
//   //   position: fixed;
//   //   // visibility: hidden;
//   //   // opacity: 0;
//   // }

//   // li {
//   //   &:not(:last-of-type) {
//   //     border-inline-end: 1px solid var(--color-neutral-60, white);
//   //   }
//   // }

//   // &[data-enabled='true'][aria-expanded='true'] + nav {
//   //   // visibility: visible;
//   //   // opacity: 1;
//   //   top: 0;
//   //   right: 0;
//   //   width: 100%;
//   //   background-color: var(--color-neutral-10);

//   //   ul {
//   //     flex-direction: column;
//   //     padding-block: var(--space-2xl);
//   //     // align-items: flex-start;

//   //     li {
//   //       a {
//   //         padding-block: var(--space-2xs);
//   //         justify-content: flex-start;
//   //         padding-inline-start: var(--space-s);
//   //       }
//   //     }
//   //   }
//   // }
// }

// .burger-toggle-enter-active,
// .burger-toggle-leave-active {
//   transition: all 250ms ease-in-out;
// }

// .burger-toggle-enter-from,
// .burger-toggle-leave-to {
//   opacity: 0;
//   transform: translateX(10rem);
// }

// .burger-toggle-enter-to,
// .burger-toggle-leave-from {
//   opacity: 1;
//   transform: translateX(0);
// }
</style>
