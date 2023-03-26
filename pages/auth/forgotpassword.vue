<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { IAuthenticatedData, emailSchema } from '~/utils/schema'

// const { setAuthUser } = useAuthStore()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const route = useRoute()
const config = useRuntimeConfig()

const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
})
const loading = ref<boolean>(false)
const emailNotVerified = ref<boolean>(false)
appErrorMsg.value = ''

const resetPassword = async () => {
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

  const { data, pending, error, refresh } = await useCsrfFetch('auth/forgotPassword', {
    baseURL: config.apiUrl,
    method: 'POST',
    body: { ...formInputs },
  })
  console.log(data.value)
  loading.value = false
  if (error.value) {
    console.log(error.value.data.errorCode)
    if (error.value.data.data.errorCode === 'email_not_verified') return (emailNotVerified.value = true)
    else return (appErrorMsg.value = error.value.statusMessage || '')
  }
  return navigateTo({
    path: '/auth/forgotpassword',
    query: {
      success: 'true',
    },
  })
  // setAuthUser(data.value as IAuthenticatedData)

  // useToast().success('Thank you for verifying your email')
  // return navigateTo({
  //   path: '/products',
  // })
}
</script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Reset Password</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <div class="success" v-if="route.query.success">
          <p>Please check your email for instructions to reset your passwpord</p>
        </div>
        <div class="form auth" v-else>
          <form @submit.prevent="resetPassword" novalidate>
            <div class="notice">
              <p>
                We will send you an email with a link to assist you with resetting your password. Check your spam folder
                for an email from: support@acs-parts.com.
              </p>
              <p>support@acs-parts.com.</p>
            </div>
            <ErrorMsg />
            <div class="error-msg" v-if="emailNotVerified">
              <p>You have not verified your email</p>
              <div class="flex gap-s">
                <span class="">Clich here to get a new verification token </span>
                <button class="tn btn-accent btn-accent-text">Signin</button>
              </div>
            </div>
            <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
            <button class="btn btn-primary">
              <span class="">Reset password</span>
              <Spinner class="spinner" v-if="loading" />
            </button>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
// .notice {
//   font-size: var(--font-size-0);
//   box-shadow: var(--shadow-lg);
//   padding: var(--space-l);
//   min-width: var(--sizing-15);
//   max-width: var(--sizing-16);
//   background-color: var(--color-primary-99);
// }
</style>
