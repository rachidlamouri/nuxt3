<script lang="ts" setup>
const props = defineProps({
  burgerVisible: { type: Boolean, default: false },
  mobileNavExpanded: { type: Boolean, default: false },
  //   showModal: { type: Boolean, default: false },
})

const showSidebarNav = ref()

defineEmits(['toggleMobileNavigation'])

const { setNotification, notification } = useNotification()

const router = useRouter()

// console.log(router.getRoutes())

const navItems = ref([
  { routeName: 'admin', title: 'Dashboard', dropdown: false },
  { routeName: 'admin-users', title: 'Users', dropdown: false },
  {
    routeName: 'admin-products',
    dropdown: true,
    title: 'Products',
    submenu: [
      { routeName: 'admin-products', title: 'Migrate' },
      { routeName: 'admin-products', title: 'Something else' },
    ],
  },
  { routeName: 'admin-users', title: 'Users', dropdown: false },
])

let timeout = ref()

watch(
  notification,
  async (currentVal, oldValue) => {
    console.log(oldValue)
    console.log(currentVal)
    clearTimeout(timeout.value)
    // if (props.duration != 0) {
    // if (props.show) {
    timeout.value = setTimeout(() => {
      // setNotification({ message: '' })
    }, 3000)
    // }
    // }
  },
  { deep: true }
)
</script>

<template>
  <div class="min-h-screen shadow-lg">
    <Burger class="admin" @burgerUpdated="showSidebarNav = $event" />
    <transition name="site-nav">
      <!-- <div class="p-xs min-w-12"> -->
      <!-- <nav class="menu sidebar | p-xs min-w-12" aria-label="sidebar-nav" v-if="showSidebarNav"> -->
      <nav class="menu sidebar | p-xs min-w-12" aria-label="sidebar-nav">
        <ul class="" role="list">
          <template v-for="(item, index) in navItems" :key="`menu-item-${index}`">
            <li class="" v-if="!item.dropdown">
              <!-- {{ item.dropdown }} -->
              <Nuxt-link class="" :to="{ name: item.routeName }" @click="$emit('toggleMobileNavigation')">
                {{ item.title }}
              </Nuxt-link>
            </li>
            <li class="dropdown" v-else>
              <button class="dropdown-trigger">{{ item.title }}</button>
              <ul class="dropdown-menu bg-primary-90" role="list">
                <li class="" v-for="(subItem, index) in item.submenu" :key="`submenu-item-${index}`">
                  <Nuxt-link :to="{ name: subItem.routeName }" @click="$emit('toggleMobileNavigation')">
                    {{ subItem.title }}
                  </Nuxt-link>
                </li>
              </ul>
            </li>
          </template>
        </ul>
        <!-- </div> -->
      </nav>
      <!-- </div> -->
    </transition>
  </div>
  <!-- <transition name="toast">
    <Toast :message="notification.message" v-if="notification.message" />
  </transition> -->
</template>

<style lang="scss" scoped>
li {
  a {
    text-decoration: none;
  }
}
// font-bold tracking-3 uppercase decoration-none center py-xs text--1 hover:bg-primary-90 hover:text-primary-10

// nav {
//   // border: 1px solid red;
//   min-width: var(--sizing-12);
//   min-height: 100vh;
//   padding: var(--space-s);
//   li {
//     font-size: var(--font-size-0);
//     a {
//       display: block;
//       padding: var(--space-4xs);
//       text-decoration: none;
//       &:hover {
//         background-color: var(--color-primary-90);
//       }
//     }
//   }
// }

// .burger {
//   &[aria-expanded='true'] + nav {
//     color: red;
//     visibility: visible;
//     opacity: 1;
//     top: 0;
//     left: 0;
//     width: 100%;
//     background-color: var(--color-neutral-10);

//     ul {
//       flex-direction: column;
//       padding-block: var(--space-2xl);
//       // align-items: flex-start;

//       li {
//         a {
//           padding-block: var(--space-2xs);
//           justify-content: flex-start;
//           padding-inline-start: var(--space-s);
//         }
//       }
//     }
//   }
// }

.site-nav-enter-active,
.site-nav-leave-active {
  transition: all 500ms ease-in-out;
}

.site-nav-enter-from,
.site-nav-leave-to {
  opacity: 0;
  transform: translateY(-10rem);
}

.site-nav-enter-to,
.site-nav-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 500ms ease-in-out;
}

.toast-enter-from,
.toast-leave-to {
  //   opacity: 0;
  transform: translateY(-20rem);
}

.toast-enter-to,
.toast-leave-from {
  //   opacity: 1;
  transform: translateY(0);
}
</style>
