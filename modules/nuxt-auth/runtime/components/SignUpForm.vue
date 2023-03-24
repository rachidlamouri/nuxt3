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
  name: 'Jane Doe',
  email: 'abbaslamouri@yrlus.com',
  password: 'Foo1234#',
})
const loading = ref<boolean>(false)
// const emailNotVerified = ref<boolean>(false)

// appErrorMsg.value = ''

// console.log('starting login2', useNuxtApp().ssrContext)

const signin = async () => {
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

const signup = async () => {
  const form = document.querySelector('form')
  const { data, pending, error, refresh } = await useCsrfFetch('/api/v1/auth/signin', {
    method: 'POST',
    body: { ...formInputs },
  })
  console.log(data.value)
  // try {
  // let result
  // const form = document.querySelector('form')

  // // Initialize error message, reset form errors & loading
  // appErrorMsg.value = ''
  // resetForm(form!)
  // loading.value = true

  // // Validate form inputs
  // const result = emailSchema.safeParse(formInputs)
  // if (!result.success) {
  //   loading.value = false
  //   return parseZodError(form!, result.error.issues || [])
  // }

  // // If user exists (based on email) redirect to login otherwise show the rest of the signup form
  // if (!newUser.value) {
  //   const { data, error } = await useFetch('auth/fetchuser', {
  //     baseURL: config.apiUrl,
  //     method: 'POST',
  //     body: { ...result.data },
  //   })

  //   console.log(data.value)
  //   loading.value = false
  //   if (error.value)
  //     // return console.log(error.value.statusMessage)

  //     return (appErrorMsg.value = error.value.statusMessage || '')
  //   // throw createError(error.value.data)

  //   if (data.value && (data.value as { userId: string | null }).userId)
  //     return navigateTo({
  //       path: '/auth/signin',
  //     })
  //   else return (newUser.value = true)
  // } else {
  //   // Validte form input
  //   const result = signupUserSchema.safeParse(formInputs)
  //   if (!result.success) {
  //     loading.value = false

  //     return parseZodError(form!, result.error.issues || [])
  //   }
  //   const { data, error } = await useFetch('auth/signup', {
  //     baseURL: config.apiUrl,
  //     method: 'POST',
  //     body: { ...formInputs },
  //   })
  //   loading.value = false
  //   if (error.value) return (appErrorMsg.value = error.value.statusMessage || '')

  //   // throw createError(error.value.data)

  //   // signupSuccess.value = true
  //   return navigateTo({
  //     path: '/auth/signup',
  //     query: {
  //       success: 'true',
  //     },
  //   })
  // }
  // } catch (err: any) {
  //   console.log('EEEE', err.data)
  //   if (err.data.name === 'zodError') parseZodError(document.querySelector('form')!, err.data)
  //   else appErrorMsg.value = err.data.message
  // } finally {
  //   loading.value = false
  // }
}

const forgotPassword = async () => {
  await navigateTo({ path: '/auth/forgotpassword', query: {} })
}
</script>

<template>
  <form @submit.prevent="signup" novalidate>
    <ErrorMsg />
    <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
    <FormsBaseInput type="text" label="Name" id="name" v-model="formInputs.name" required />
    <FormsPasswordInput
      type="password"
      label="Passsword"
      id="password"
      required
      v-model="formInputs.password"
      action="signup"
    />
    <button class="btn btn-primary">
      <span class="">Signup</span>
      <Spinner class="spinner" v-if="loading" />
    </button>
    <div class="link">
      <span class="">Already have an account? </span>
      <NuxtLink class="btn btn-accent btn-accent-text" :to="{ name: 'auth-signin' }"> Signin </NuxtLink>
    </div>
  </form>
</template>

<style labg="scss" scoped></style>
