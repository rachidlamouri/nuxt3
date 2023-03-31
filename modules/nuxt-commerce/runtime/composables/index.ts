import { useNuxtApp, useFetch } from '#app'
// export function useCsrf() {
//   const nuxtApp = useNuxtApp()
//   console.log('TTTTT', nuxtApp.payload.csrfToken)
//   if (process.server) {
//     const res = nuxtApp.ssrContext?.event.node.res ?? {}
//     if ('_csrftoken' in res) {
//       nuxtApp.payload.csrfToken = res._csrftoken
//     }
//   }
//   return { csrf: nuxtApp.payload.csrfToken }
// }
export const useCsrfFetch = (request: string, opts) => {
  const nuxtApp = useNuxtApp()
  const sessionToken = nuxtApp.payload.sessionToken
  const headers = { ...useRequestHeaders(['cookie']), sessionToken }
  const options = { ...opts }
  if (opts.body) {
    options.body.sessionToken = sessionToken
  }
  options.params = { ...options.params, sessionToken: sessionToken }
  return useFetch(request, { ...options, headers })
}

export const useAuthStore = () => {
  const authUser = useState('authUser', () => {
    return { userName: '', authenticated: false }
  })

  const authenticated = computed(() => (authUser.value.authenticated ? true : false))

  return {
    authUser,
    authenticated,
  }
}
