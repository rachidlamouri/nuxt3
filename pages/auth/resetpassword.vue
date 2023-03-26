<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { IAuthenticatedData, passwordSchema } from '~/utils/schema'

// const { setAuthUser } = useAuthStore()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const config = useRuntimeConfig()

const route = useRoute()

const formInputs = reactive({
  password: 'Foo1234$',
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
  const result = passwordSchema.safeParse(formInputs)
  if (!result.success) {
    loading.value = false
    return parseZodError(form!, result.error.issues || [])
  }

  // const { data, error } = await useFetch('auth/resetpassword', {
  //   baseURL: config.apiUrl,
  //   method: 'POST',
  //   body: { ...formInputs },
  //   params: { passwordResetToken: route.query.passwordResetToken },
  // })

  const { data, pending, error, refresh } = await useCsrfFetch('auth/resetPassword', {
    baseURL: config.apiUrl,
    method: 'POST',
    body: { ...formInputs },
    params: { passwordResetToken: route.query.passwordResetToken },
  })
  console.log(data.value)
  loading.value = false
  if (error.value) {
    console.log(error.value.data.errorCode)
    if (error.value.data.data.errorCode === 'email_not_verified') return (emailNotVerified.value = true)
    else return (appErrorMsg.value = error.value.statusMessage || '')
  }

  useToast().success('Your password has been reset')

  return navigateTo({
    path: '/auth/signin',
  })
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
        <div class="form auth">
          <form @submit.prevent="resetPassword" novalidate>
            <ErrorMsg />
            <div class="error-msg" v-if="emailNotVerified">
              <p>You have not verified your email</p>
              <div class="flex gap-s">
                <span class="">Clich here to get a new verification token </span>
                <button class="tn btn-accent btn-accent-text">Signin</button>
              </div>
            </div>
            <FormsPasswordInput
              type="password"
              label="Enter a new passsword"
              id="password"
              required
              v-model="formInputs.password"
              action="signup"
            />
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
