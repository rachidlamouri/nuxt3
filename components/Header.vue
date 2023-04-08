<script lang="ts" setup>
// import { storeToRefs } from 'pinia'
// import { useCartStore } from '~~/stores/useCartStorexxexx'
import { useToast } from 'vue-toastification'
import { IAuthenticatedData } from '~/utils/schema'
// const { status, data, signIn, signOut } = useSession()

const status = false

// const nuxtApp = useNuxtApp()
// console.log(nuxtApp.payload)

// console.log('CC', useCookie('csrf').value)

// const { data, pending, error, refresh } = await useCsrfFetch('session/getSession', {
//   baseURL: config.apiUrl,
//   method: 'GET',
//   // params: { nonce: useCookie('csrf').value },
// })
// console.log(data.value)
// console.log(config.public.nuxtSession.userSessionId)
// console.log(useCookie(config.public.nuxtSession.userSessionId))
const config = useRuntimeConfig()
const { authUser, authenticated } = useAuthStore()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()

// const { session } = await useSession()

// const { data, pending, error, refresh } = await useSession('/api/v1/session/getSession', {
//   method: 'GET',
//   // body: { ...formInputs },
// })
// console.log(data.value)
// if (error.value) console.log(error.value.data)

// import IAuthUser from '~/ToDeelete/types/IAuthUser'

const props = defineProps({
  resized: {
    type: Boolean,
    default: false,
  },
  scrolled: {
    type: Boolean,
    default: false,
  },
  headerWidth: {
    type: [Number, String],
    // default: 0,
  },
})

// const { data, pending, error, refresh } = await useCsrfFetch('session', {
//   baseURL: config.apiUrl,
//   method: 'GET',
//   // body: { ...formInputs },
// })
// console.log(data.value)
// authUser.value.authenticated = data.value.authenticated
// authUser.value.userName = data.value.userName

// const { data, pending, error, refresh } = await useCsrfFetch('session', {
//   baseURL: config.apiUrl,
//   method: 'GET',
// })
// console.log(data.value)

onMounted(async () => {
  // getSession()
  // console.log('IIIIII', session.value)
  // authUser.value.authenticated = session.value.authenticated
  // authUser.value.userName = session.value.userName
})

const { numberOfItems } = useCartStore()

// const { setNotification, notification } = useNotification()

const mainNavExpanded = ref(false)
let timeout = ref()
const burgerActive = ref()
const customerSubMenuExpanded = ref(false)
const cartModalRef = ref()
const searchModalRef = ref()
const dropdownMenuRef = ref()
const dropdownTriggerRef = ref()
const signinBtnRef = ref()
const signupBtnRef = ref()
const router = useRouter()
// console.log(router)

const { cart } = useCartStore()
const { loadCart } = useCartStore()

// const xyz = useCookie('cartTotal')
// console.log(xyz.value)

const signup = async () => {
  signupBtnRef.value.blur()
  await navigateTo({ path: '/auth/signup', query: { action: 'signup' } })
}

const signin = async () => {
  // console.log('KKKKKK')
  signinBtnRef.value.blur()
  await navigateTo({ path: '/auth/signin', query: {} })
}

const profile = async () => {
  signupBtnRef.value.blur()
  await navigateTo({ path: '/auth', query: { action: 'signup' } })
}

const signout = async () => {
  const { data, pending, error, refresh } = await useCsrfFetch('auth/signout', {
    baseURL: config.apiUrl,
    method: 'POST',
    body: {},
  })
  // console.log(data.value)
  // console.log(error.value.data)
  // loading.value = false
  if (error.value) return (appErrorMsg.value = error.value.statusMessage || '')

  authUser.value = { ...data.value }

  // window.location.reload()
  // await navigateTo({
  //   path: '/',
  // })
  window.location.reload()

  useToast().success('You are logged out')
  // const { data, pending, error } = await useFetch('auth/signout', {
  //   method: 'POST',
  //   baseURL: config.apiUrl,
  //   body: {
  //     // authToken: useCookie('authToken').value || '',
  //   },
  //   // params: { action: 'signout' },
  // })
  // if (error.value) throw createError(error.value)
  // console.log(data.value)
  // if (data.value) {
  //   const authToken = useCookie('authToken', { maxAge: 1 })
  //   authToken.value = ''
  //   authUser.value.name = ''
  //   authUser.value.authToken = ''
  // }

  // await signOut({ redirect: false })

  // useToast().success('You are logged out')

  // setAuthUser({ name: '', authenticated: false })
  // await navigateTo({ path: '/' })
}

const closeSearchModal = () => {
  searchModalRef.value.close()
}

const searchModalClosed = (event: any) => {
  // console.log(event)
}

const searchModalCancelled = (event: any) => {
  // console.log(event)
}

const closeCartModal = (event: any) => {
  cartModalRef.value.close()
}

const cartModalClosed = (event: any) => {
  // console.log(event)
}

const cartModalCancelled = (event: any) => {
  // console.log(event)
}

const getProduct = async (slug: string) => {
  // console.log(slug)
  closeSearchModal()
  await navigateTo({ path: `/products/${slug}` })
}

onMounted(() => {
  cartModalRef.value.addEventListener('click', (event: any) => {
    if (event.target.nodeName === 'DIALOG') {
      cartModalRef.value.close()
    }
  })

  searchModalRef.value.addEventListener('click', (event: any) => {
    if (event.target.nodeName === 'DIALOG') {
      searchModalRef.value.close()
    }
  })
})

const navItems = ref([
  { routeName: 'index', title: 'Home' },
  { routeName: 'products', title: 'Our parts' },
  { routeName: 'index', title: 'Capabilities' },
  { routeName: 'index', title: 'News' },
  { routeName: 'contact', title: 'Contact Us' },
  { routeName: 'about', title: 'About Us' },
  { routeName: 'admin-users', title: 'Users' },
  { routeName: 'admin-products-migrate', title: 'Migrate Products' },
])

watch(
  () => props.headerWidth,
  (currentVal, oldValue) => {
    burgerActive.value = false
  },
  { deep: true }
)

// watch(
//   status,
//   async (newVal, oldVal) => {
//     console.log(oldVal)
//     console.log(newVal)
//     // if (props.duration != 0) {
//     // if (props.show) {
//   },
//   { deep: true }
// )
</script>

<template>
  <div>
    <SkipLink />
    <div class="container | flow-s">
      <!-- HEASER TOP -->
      <div class="main-header__top">
        <div class="branding">
          <Nuxt-link :to="{ name: 'index' }" aria-label="Aviation Component Solutions">
            <img class="" src="/images/logo-transparent.svg" alt="ACS Logo Home Page" v-if="!scrolled" />
            <img class="" src="/images/logo-color.svg" alt="ACS Logo Home Page" v-else />
          </Nuxt-link>
        </div>
        <!-- {{ useNuxtApp().payload.csrfToken }}----{{ useNuxtApp().payload.sessionMeta }} -->
        <nav class="top-nav" aria-label="Top Navigation">
          <ul class="" role="list">
            <li>
              <button class="btn" @click="$emit('showSearchModal')">
                <Icon class="" name="mdi:magnify" />
                <span class="btn-text">Search Products</span>
              </button>
            </li>
            <li class="dropdown">
              <button
                class="dropdown__trigger | btn"
                type="button"
                :aria-expanded="customerSubMenuExpanded"
                :aria-label="customerSubMenuExpanded ? 'Close customer sub menu' : 'Open customer sub menu'"
                aria-controls="auth-dropdown"
                ref="dropdownTriggerRef"
              >
                <Icon class="" name="mdi:account-outline" />
                <span class="btn-text" v-if="authenticated">Welcome {{ authUser.userName }}</span>
                <span class="btn-text" v-else>Sign in / Create account</span>
              </button>
              <ul class="dropdown__menu" id="auth-dropdown" role="list" ref="dropdownMenuRef">
                <li class="">
                  <button class="btn" ref="signinBtnRef" @click="profile" v-if="authenticated">profile</button>
                  <button class="btn" ref="signinBtnRef" @click.prevent="signin" v-else>Signin</button>
                </li>
                <li class="">
                  <button class="btn" ref="signoutBtnRef" @click="signout" v-if="authenticated">Signout</button>
                  <button class="btn" ref="signupBtnRef" @click.prevent="signup" v-else>Create account</button>
                </li>
              </ul>
            </li>
            <li>
              <button class="btn" @click="cartModalRef.showModal()">
                <Icon class="" name="mdi:cart-outline" />
                <span class="btn-text">Your Bag ({{ numberOfItems() }})</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- HEADER BOTTOM -->
      <div class="main-header__bottom">
        <transition name="burger">
          <button
            class="burger"
            type="button"
            v-if="resized"
            :aria-expanded="burgerActive"
            :aria-label="burgerActive ? 'Close admin sidebar' : 'Open admin sidebar'"
            @click="burgerActive = !burgerActive"
          >
            <span class="burger-bar"></span>
            <span class="visually-hidden">Main Menu</span>
          </button>
        </transition>
        <transition name="main-nav">
          <nav
            class="main-nav"
            :class="{ expanded: mainNavExpanded }"
            aria-label="primary-nav"
            v-if="!resized || (resized && burgerActive)"
          >
            <ul class="" role="list">
              <li class="" v-for="(item, index) in navItems" :index="`menu-item-${index}`">
                <Nuxt-link class="" :to="{ name: item.routeName }" @click="burgerActive = false">
                  {{ item.title }}
                </Nuxt-link>
              </li>
            </ul>
          </nav>
        </transition>
      </div>

      <div class="dialog search">
        <transition name="serach-modal">
          <dialog ref="searchModalRef" @close="searchModalClosed" @cancel="searchModalCancelled">
            <SearchResults @searchModalClosed="closeSearchModal" @getProduct="getProduct" />
          </dialog>
        </transition>
      </div>
      <div class="dialog cart">
        <transition name="cart-modal">
          <dialog ref="cartModalRef" @close="cartModalClosed" @cancel="cartModalCancelled">
            <!-- <ClientOnly> -->
            <CommerceCart @closeCartModal="closeCartModal" />
            <!-- </ClientOnly> -->
          </dialog>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-modal-enter-active,
.cart-modal-leave-active {
  transition: all 2500ms ease-in-out;
}

.cart-modal-enter-from,
.cart-modal-leave-to {
  opacity: 0;
  transform: translateX(1000rem);
}

.cart-modal-enter-to,
.cart-modal-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
