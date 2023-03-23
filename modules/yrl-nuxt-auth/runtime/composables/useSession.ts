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

  const _sessionRequest = (method, body) => {
    const opts = { method: method.toUpperCase(), body }

    return useFetch(sessionOptions.api.basePath, {
      method: method.toUpperCase(),
      body,
      server: false,
      onResponse({ request, response, options }) {
        console.log('QQQQQ', response._data)
        // Process the response data
        session.value = response._data
        return response._data
      },
    })
  }

  await _sessionRequest('GET', {})
  return { session }
}
