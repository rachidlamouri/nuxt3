import { IAuthenticatedData } from '~/utils/schema'

export default defineNuxtPlugin(async (nuxtApp) => {
  // const config = useRuntimeConfig()
  // const { setAuthUser } = useAuthStore()
  // nuxtApp.hook('app:mounted', async () => {
  //   const authToken = useCookie('authToken') && useCookie('authToken').value ? useCookie('authToken').value : ''
  //   const { data, error } = await useFetch(`/api/v1/auth/fetchAuthenticated`, {
  //     method: 'GET',
  //     baseURL: config.apiUrl,
  //     params: {
  //       authToken,
  //     },
  //   })
  //   if (!error.value && data.value) setAuthUser(data.value as IAuthenticatedData)
  // })
})
