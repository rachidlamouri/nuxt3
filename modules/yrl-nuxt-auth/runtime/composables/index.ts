export const useCsrf = () => {
  const nuxtApp = useNuxtApp()
  // if (process.server) {
  //   const res = nuxtApp.ssrContext?.event.node.res ?? {}
  //   if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
  // }
  return { csrf: nuxtApp.payload.csrfToken }
}

export const useCsrfFetch = (request: string, options) => {
  const { csrf } = useCsrf()

  console.log(options)

  options.headers = { ...useRequestHeaders(), 'csrf-token': csrf }

  // // opts = opts || {}
  // opts.headers = opts.headers || {}
  // opts.headers['csrf-token'] = csrf // add csrftoken to req headers
  // console.log('LLLLLLL', opts)
  // console.log('request', request)

  return useFetch(request, options)
}
