<script lang="ts" setup>
import { useToast } from 'vue-toastification'

import { emailSchema } from '~/utils/schema'

const route = useRoute()
const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const config = useRuntimeConfig()
const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
})
const loading = ref<boolean>(false)
appErrorMsg.value = ''

const verify = async () => {
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

  // const { data, error } = await useFetch('auth/verify', {
  //   baseURL: config.apiUrl,
  //   method: 'POST',
  //   body: { ...formInputs },
  //   params: { signupToken: route.query.signupToken },
  // })

  const { data, pending, error, refresh } = await useCsrfFetch('auth/verify', {
    baseURL: config.apiUrl,
    method: 'POST',
    body: { ...result.data },
    params: { signupToken: route.query.signupToken },
  })
  loading.value = false
  if (error.value) {
    return (appErrorMsg.value = error.value.statusMessage || '')
  }

  useToast().success('Thank you for verifying your email')

  return navigateTo({
    path: '/auth/signin',
  })
}
</script>

<template>
  <div class="content-wrapper">
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #heading>
        <h1>Verify your email</h1>
      </template>
    </Hero>
    <article class="container-wrapper">
      <div class="container | flow">
        <div class="form auth">
          <form @submit.prevent="verify" novalidate>
            <ErrorMsg />
            <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
            <button class="btn btn-primary">
              <span class="">Verify email</span>
              <Spinner class="spinner" v-if="loading" />
            </button>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style labg="scss" scoped></style>
