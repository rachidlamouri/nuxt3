import { useNuxtApp, useFetch } from '#app'
export function useCsrf() {
  const nuxtApp = useNuxtApp()
  if (process.server) {
    const res = nuxtApp.ssrContext?.event.node.res ?? {}
    if ('_csrftoken' in res) {
      nuxtApp.payload.csrfToken = res._csrftoken
    }
  }
  return { csrf: nuxtApp.payload.csrfToken }
}
export function useCsrfFetch(request, opts) {
  const { csrf } = useCsrf()
  opts = opts || {}
  opts.headers = opts.headers || {}
  opts.headers['csrf-token'] = csrf
  // console.log("OPTS", opts)
  return useFetch(request, opts)
}
