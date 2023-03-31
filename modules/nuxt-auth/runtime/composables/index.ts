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
export function useCsrfFetch(request: string, opts) {
  const nuxtApp = useNuxtApp()
  // const csrf = nuxtApp.payload.csrfToken
  const sessionToken = nuxtApp.payload.sessionToken
  // getHeader(event, 'csrf')
  // const { csrf } = useCsrf()
  const headers = { ...useRequestHeaders(['cookie']), sessionToken }
  const options = { ...opts }
  if (opts.body) {
    // options.body.nonce = csrf
    options.body.sessionToken = sessionToken
  }
  if (opts.params) options.params.nonce = sessionToken
  return useFetch(request, { ...options, headers })
}
