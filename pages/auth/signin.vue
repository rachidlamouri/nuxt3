<script setup lang="ts">
const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: 'Foo1234#',
})

const signin = async () => {
  const form = document.querySelector('form')

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

  const { data, error } = await useFetch('/api/v1/auth/signin', {
    // baseURL: config.apiUrl,
    method: 'POST',
    body: { ...formInputs },
  })
  // loading.value = false
  if (error.value) console.log('ERROR', error.value.data)
  console.log('DATA', data.value)

  // console.log(error.value.data.errorCode)
  // if (error.value.data.data.errorCode === 'email_not_verified') return (emailNotVerified.value = true)
  // else return (appErrorMsg.value = error.value.statusMessage || '')

  // setAuthUser(data.value)
  // const authToken = useCookie('authToken', { maxAge: (data.value as IAuthenticatedData).cookieMaxAge || 1 })
  // authToken.value = (data.value as IAuthenticatedData).authToken || ''
  // authUser.value.name = (data.value as IAuthenticatedData).name || ''
  // authUser.value.authToken = (data.value as IAuthenticatedData).authToken || ''

  // useToast().success('You are logged in')

  // return navigateTo({
  //   path: '/products',
  // })
}
</script>
<template>
  <div>
    <input type="text" label="email" v-model="formInputs.email" />
    <input type="text" label="[password]" v-model="formInputs.password" />
    <button @click="signin">submit</button>
  </div>
</template>

<style scoped></style>
