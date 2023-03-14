<script setup lang="ts">
// const { user, setAuthUser } = useAuthStore()
// const { notification, setNotification } = useNotification()

// const router = useRouter()
// const user = reactive({
//   email: 'janedoe@xyz.com',
//   password: 'adrar0714',
// })
// const loading = ref(false)

// const signout = async () => {
//   loading.value = true

//   const { data, error } = await useFetch('/api/v1/auth/signin', {
//     method: 'POST',
//   })

//   // if (error.value && error.value.data) return setNotification({ message: error.value.data.statusMessage })

//   loading.value = false

//   setAuthUser({})

//   router.push({ name: 'index' })

//   setNotification({ message: 'You are logout' })
// }
</script>

<template>
  <div class="">
    <!-- <div>{{ user }}</div>
  <div>
    <NuxtLink :to="{ name: 'index' }">
      <span>Home</span>
    </NuxtLink>
    <NuxtLink :to="{ name: 'auth-signup' }">
      <span>Signup</span>
    </NuxtLink>
    <NuxtLink :to="{ name: 'auth-signin' }">
      <span>Signin</span>
    </NuxtLink>
    <button @click="signout">
      <span>Logout</span>
    </button> -->
  </div>
</template>

<style scoped>
/* a {
  margin: 1rem;
} */
</style>
