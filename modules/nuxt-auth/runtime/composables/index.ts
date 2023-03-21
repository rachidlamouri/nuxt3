export function useCsrf() {
  const nuxtApp = useNuxtApp()
  // if (process.server) {
  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  console.log('KKKKKK', res._csrftoken)
  // if ('_csrftoken' in res) {
  //   nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
  // }
  // }
  // return { csrf: nuxtApp.payload.csrfToken }
}
