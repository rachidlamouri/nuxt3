<script lang="ts" setup>
import { emailSchema, signupUserSchema } from '~/utils/schema'

const route = useRoute()
const { appErrorMsg, resetForm, clientFormValidator, parseZodError } = useErrorStore()
const config = useRuntimeConfig()
const formInputs = reactive({
  name: 'Jane Doe',
  email: 'abbaslamouri@yrlus.com',
  password: 'Foo1234#',
})
const acceptTerms = ref<boolean>(true)
const loading = ref<boolean>(false)
const newUser = ref<boolean>(false)

// appErrorMsg.value = ''

const signup = async () => {
  try {
    const form = document.querySelector('form')

    // Initialize error message, reset form errors & loading
    appErrorMsg.value = ''
    resetForm(form!)
    loading.value = true

    // Validate form inputs
    const result = emailSchema.safeParse(formInputs)
    if (!result.success) {
      loading.value = false
      return parseZodError(form!, result.error.issues || [])
    }
    // If user exists (based on email) redirect to login otherwise show the rest of the signup form
    if (!newUser.value) {
      const { data, pending, error, refresh } = await useCsrfFetch('auth/fetchAuthUser', {
        baseURL: config.apiUrl,
        method: 'POST',
        body: { ...result.data },
      })
      // const { data, error } = await useFetch('auth/fetchuser', {
      //   baseURL: config.apiUrl,
      //   method: 'POST',
      //   body: { ...result.data },
      // })
      console.log(data.value)
      loading.value = false

      if (error.value) return (appErrorMsg.value = error.value.statusMessage || '')
      // throw createError(error.value.data)
      if (data.value && (data.value as { userId: string | null }).userId)
        return navigateTo({
          path: '/auth/signin',
        })
      else return (newUser.value = true)
    } else {
      // Check if user accepted terms & conditions
      if (!acceptTerms.value) {
        appErrorMsg.value = 'You must accept our terms and conditions'
        return
      }
      // Validte form input
      const result = signupUserSchema.safeParse(formInputs)
      if (!result.success) {
        loading.value = false
        return parseZodError(form!, result.error.issues || [])
      }
      const { data, pending, error, refresh } = await useCsrfFetch('auth/signup', {
        baseURL: config.apiUrl,
        method: 'POST',
        body: { ...result.data },
      })
      // const { data, error } = await useFetch('auth/signup', {
      //   baseURL: config.apiUrl,
      //   method: 'POST',
      //   body: { ...result.data },
      // })
      loading.value = false
      console.log(data.value)
      // console.log(error.value.data)
      if (error.value) return (appErrorMsg.value = error.value.statusMessage || '')
      // throw createError(error.value.data)
      // signupSuccess.value = true
      return navigateTo({
        path: '/auth/signup',
        query: {
          success: 'true',
        },
      })
    }
  } catch (err: any) {
    console.log('EEEE', err)
    if (err.data.name === 'zodError') parseZodError(document.querySelector('form')!, err.data)
    else appErrorMsg.value = err.data.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Register</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <div class="success" v-if="route.query.success">
          <div class="inner">
            <p>All right, One last step:</p>
            <p>verify your email</p>
            <p>-----</p>
            <p>We just sent you an email to the address you provided.</p>
            <p>Click on the link in the email to verify your email address and access you account.</p>
            <p>Please add support@acs.com to your whitelis.</p>
          </div>
        </div>
        <div class="form auth" v-else>
          <form @submit.prevent="signup" novalidate>
            <ErrorMsg />
            <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
            <FormsBaseInput type="text" label="Name" id="name" v-model="formInputs.name" required v-if="newUser" />
            <FormsPasswordInput
              type="password"
              label="Passsword"
              id="password"
              required
              v-model="formInputs.password"
              action="signup"
              v-if="newUser"
            />
            <div class="link" v-if="newUser">
              <FormsBaseCheckbox id="acceptTerms" label="" v-model="acceptTerms" />
              <span>I accept YRL Consulting</span>
              <NuxtLink class="btn btn-accent btn-accent-text" to="/">Terms and Conditions</NuxtLink>
            </div>

            <button class="btn btn-primary">
              <span class="">Signup</span>
              <Spinner class="spinner" v-if="loading" />
            </button>
            <div class="link">
              <span class="">Already have an account? </span>
              <NuxtLink class="btn btn-accent btn-accent-text" :to="{ name: 'auth-signin' }"> Signin </NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.success {
  display: flex;
  justify-content: center;
  .inner {
    font-size: var(--font-size-0);
    box-shadow: var(--shadow-lg);
    padding: var(--space-l);
    max-width: var(--sizing-16);
    background-color: var(--color-primary-99);
  }
}
</style>
