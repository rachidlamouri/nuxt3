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
export function useCsrfFetch(request: string, opts) {
  const { csrf } = useCsrf()
  const headers = { ...useRequestHeaders(['cookie']), csrf }
  opts.body = opts.body ? { ...opts.body, nonce: csrf } : {}
  opts.params = opts.params ? { ...opts.params, nonce: csrf } : {}
  return useFetch(request, { ...opts, headers })
}
