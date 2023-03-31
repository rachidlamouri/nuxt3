<script lang="ts" setup>
const sbClient = useSupabaseAuthClient()

definePageMeta({
  layout: 'admin',
})

const loading = ref<boolean>(false)

const formInputs = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  password: '',
})

const addProduct = async () => {
  loading.value = true

  // const { data, error } = await sbClient
  //   .from('Products')
  //   .insert([{ some_column: 'someValue', other_column: 'otherValue' }])

  const { data, error } = await sbClient.auth.signUp({
    ...formInputs,
    options: {
      data: {
        name: formInputs.name,
        age: 27,
      },
    },
  })
  console.log('D', data)
  console.log('E', error)
  loading.value = false
}
</script>

<template>
  <div class="h-full flex-1 b-green">Products</div>
  <button class="btn btn-accent btn-accent-text uppercase" @click.prevent="addProduct">Add Product</button>
</template>

<style lang="scss" scoped></style>
