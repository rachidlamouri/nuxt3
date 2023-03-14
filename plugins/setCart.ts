export default defineNuxtPlugin(async (nuxtApp) => {
  const { cart } = useCartStore()
  nuxtApp.hook('app:mounted', async () => {
    // const cartId = useCookie('cartId') && useCookie('cartId').value ? useCookie('cartId').value : ''
    // const { data, error } = await useFetch(`/api/v1/orders`, {
    //   method: 'GET',
    //   params: {
    //     cartId,
    //   },
    // })
    // console.log('DDDDD', data.value)
    // console.log('EEEEE', error.value)
    // if (!error.value && data.value && Object.values(data.value).length) cart.value = data.value
  })
})
