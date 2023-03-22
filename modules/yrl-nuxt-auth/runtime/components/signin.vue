<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { IAuthenticatedData, signinUserSchema } from '~/utils/schema'
// definePageMeta({ auth: false })

// const { status, data, signIn, signOut } = useSession()
// status.value // Session status: `unauthenticated`, `loading`, `authenticated`
// data.value // Session data, e.g., expiration, user.email, ...
// await signIn() // Sign in the user
// await signOut() // Sign out the user

// console.log(status.value)
// console.log(data.value)

// const csrf = useCsrf()
// console.log(csrf)

// const { authUser } = useAuthStore()
// const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const config = useRuntimeConfig()

const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: 'Foo1234#',
})
const loading = ref<boolean>(false)
// const emailNotVerified = ref<boolean>(false)

// appErrorMsg.value = ''

// console.log('starting login2', useNuxtApp().ssrContext)

const signin = async () => {
  const form = document.querySelector('form')
  // const { data, pending, error, refresh } = useCsrfFetch('/api/v2/auth/signin', { method: 'POST', body: { id: 1 } })
  // console.log(useNuxtApp())
  // useCsrf()
  // console.log('starting login')
  // console.log('starting login2', useNuxtApp().ssrContext)

  // Initialize error message, reset form errors & loading
  // appErrorMsg.value = ''
  // resetForm(form!)
  // loading.value = true

  // Validate form inputs
  // const result = signinUserSchema.safeParse(formInputs)
  // if (!result.success) {
  //   loading.value = false
  //   return parseZodError(form!, result.error.issues || [])
  // }

  // const { data, error } = await useFetch('/api/v2/auth/signin', {
  //   // baseURL: config.apiUrl,
  //   method: 'POST',
  //   body: { ...formInputs },
  // })
  // loading.value = false

  // if (error.value) {
  //   // console.log(error.value.data.errorCode)
  //   if (error.value.data.data.errorCode === 'email_not_verified') return (emailNotVerified.value = true)
  //   else return (appErrorMsg.value = error.value.statusMessage || '')
  // }
  // console.log(data.value)
  // await signIn('credentials', { username: formInputs.email, password: formInputs.password, callbackUrl: '/products' })
  // const authToken = useCookie('authToken', { maxAge: (data.value as IAuthenticatedData).cookieMaxAge || 1 })
  // authToken.value = (data.value as IAuthenticatedData).authToken || ''
  // authUser.value.name = (data.value as IAuthenticatedData).name || ''
  // authUser.value.authToken = (data.value as IAuthenticatedData).authToken || ''
  // if (status.value === 'authenticated') useToast().success('You are logged in')

  // return navigateTo({
  //   path: '/products',
  // })
}

const forgotPassword = async () => {
  await navigateTo({ path: '/auth/forgotpassword', query: {} })
}
</script>

<template>
  <form class="" @submit.prevent="signin" novalidate>
    <ErrorMsg />
    <!-- <div class="error-msg" v-if="emailNotVerified">
      <p>This email has nor been verified</p>
      <div class="link">
        <span class="">Clich here to get a new verification token </span>
        <button class="btn btn-accent btn-accent-text">
          <span class="">Signin</span>
        </button>
      </div>
    </div> -->
    <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
    <FormsPasswordInput type="password" label="Passsword" id="password" required v-model="formInputs.password" />
    <FormsBaseCheckbox id="remember-me" label="Remmeber me" />
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
</template>

<style labg="scss" scoped></style>
