<script lang="ts" setup>
import { useToast } from 'vue-toastification'
// import { IAuthenticatedData, signinUserSchema } from '~/utils/schema'
// // definePageMeta({ auth: false })

// const { status, data, signIn, signOut } = useSession()
// // status.value // Session status: `unauthenticated`, `loading`, `authenticated`
// // data.value // Session data, e.g., expiration, user.email, ...
// // await signIn() // Sign in the user
// // await signOut() // Sign out the user

// console.log(status.value)
// console.log(data.value)

const { authUser } = useAuthStore()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const config = useRuntimeConfig()

const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: 'Foo1234#',
  rememberMe: false,
})
const loading = ref<boolean>(false)
// const emailNotVerified = ref<boolean>(false)

// appErrorMsg.value = ''

const signin = async () => {
  const form = document.querySelector('form')
  // Initialize error message, reset form errors & loading
  appErrorMsg.value = ''
  resetForm(form!)
  loading.value = true

  // Validate form inputs
  const result = signinUserSchema.safeParse(formInputs)
  if (!result.success) {
    loading.value = false
    return parseZodError(form!, result.error.issues || [])
  }

  const { data, pending, error, refresh } = await useCsrfFetch('auth/signin', {
    baseURL: config.apiUrl,
    method: 'POST',
    body: { ...formInputs },
  })
  console.log(data.value)
  // console.log(error.value.data)
  loading.value = false
  if (error.value) return (appErrorMsg.value = error.value.statusMessage || '')
  authUser.value = { ...data.value }

  // window.location.reload()
  await navigateTo({
    path: '/',
  })
  useToast().success('You are logged in')
}

const forgotPassword = async () => {
  await navigateTo({ path: '/auth/forgotpassword', query: {} })
}
</script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Login</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <!-- <SignInForm /> -->
        <div class="form auth">
          <form class="" @submit.prevent="signin" novalidate>
            <ErrorMsg />
            <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
            <FormsPasswordInput
              type="password"
              label="Passsword"
              id="password"
              required
              v-model="formInputs.password"
            />
            <FormsBaseCheckbox id="remember-me" label="Remmeber me" v-model="formInputs.rememberMe" />
            <div class="">
              <button class="btn btn-accent btn-accent-text" @click.prevent="forgotPassword">Forgot password?</button>
            </div>
            <button class="btn btn-primary">
              <span class="">Signin</span>
              <Spinner class="spinner" v-if="loading" />
            </button>
            <div class="link">
              <span class="">Don't have an account? </span>
              <NuxtLink class="btn btn-accent btn-accent-text" :to="{ name: 'auth-signup' }"> Signup </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style labg="scss" scoped></style>
