// export const useCsrf = () => {
//   const nuxtApp = useNuxtApp()
//   // if (process.server) {
//   //   const res = nuxtApp.ssrContext?.event.node.res ?? {}
//   //   if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
//   // }
//   return { csrf: nuxtApp.payload.csrfToken }
// }

export default async () => {
  const config = useRuntimeConfig()
  // console.log('NNNNN', config.public.yrlNuxtAuth)
  const sessionOptions = config.public.yrlNuxtAuth.session
  const session = ref()
  console.log('PPPPPP', sessionOptions.api.basePath)

  const _sessionRequest = (method, body) => {
    const opts = { method: method.toUpperCase(), body }

    return useFetch('/api/v1/session/getSession', {
      method: 'GET',
      // body,
      // server: false,
      onResponse({ request, response, options }) {
        console.log('QQQQQ', response._data)
        // Process the response data
        session.value = response._data
        return response._data
      },
    })
  }

  await _sessionRequest('get', {})
  return { session }
}

// export function useCsrfFetch(request, opts) {
//   const { csrf } = useCsrf()
//   opts = opts || {}
//   opts.headers = opts.headers || {}
//   opts.headers['csrf-token'] = csrf
//   // console.log("OPTS", opts)
//   return useFetch(request, opts)
// }
