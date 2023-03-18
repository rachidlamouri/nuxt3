<script setup lang="ts">
import { useToast } from 'vue-toastification'

const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const config = useRuntimeConfig()

const formInputs = reactive({
  name: 'abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  phoneNumber: '555-555-5555',
  subject: 'Text from contact page',
  message: 'This is the message text',
})

const loading = ref<boolean>(false)

const sendMessage = async () => {
  console.log(config)
  const form = document.querySelector('form')

  // Initialize error message, reset form errors & loading
  appErrorMsg.value = ''
  resetForm(form!)
  loading.value = true

  // Validate form inputs
  const result = contactFormSchema.safeParse(formInputs)
  if (!result.success) {
    loading.value = false
    return parseZodError(form!, result.error.issues || [])
  }

  const { data, error } = await useFetch('/api/mailer/sendmail', {
    method: 'POST',
    body: { ...formInputs },
  })
  loading.value = false
  if (error.value) {
    console.log(error.value.data)
    return (appErrorMsg.value = error.value.statusMessage || '')
  }
  if (data.value && data.value.statusCode === 202) useToast().success(config.public.mailer.emailSentMessage)
}
</script>

<template>
  <form class="" @submit.prevent="sendMessage" novalidate>
    <ErrorMsg />
    <FormsBaseInput type="text" label="Name" id="name" v-model="formInputs.name" required />
    <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
    <FormsBaseInput type="text" label="Phone Number" id="phone-number" v-model="formInputs.phoneNumber" required />
    <FormsBaseTextarea
      label="Mesage"
      id="message"
      placeholder="enter your messsage"
      v-model="formInputs.message"
      rows="5"
      required
    />
    <button class="btn btn-primary">
      <span class="">Send</span>
      <Spinner class="spinner" v-if="loading" />
    </button>
  </form>
</template>

<style scoped></style>
