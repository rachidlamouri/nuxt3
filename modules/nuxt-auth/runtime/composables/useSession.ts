// import { getUserSession } from './../../../nuxt-session/runtime/server/services/index';
// export const useCsrf = () => {
//   const nuxtApp = useNuxtApp()
//   // if (process.server) {
//   //   const res = nuxtApp.ssrContext?.event.node.res ?? {}
//   //   if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
//   // }
//   return { csrf: nuxtApp.payload.csrfToken }
// }
import { getUserSession } from '#auth'

export default async () => {
  const config = useRuntimeConfig()
  const session = ref(0)
  // console.log('NNNNN', config.public.yrlNuxtAuth)
  // const sessionOptions = config.public.yrlNuxtAuth.session
  // const session = ref()
  // console.log('PPPPPP', sessionOptions.api.basePath)

  // const _sessionRequest = (method, body) => {
  const getSession = async () => {
    // const opts = { method: method.toUpperCase(), body }

    const { data } = useCsrfFetch('session/getSession', {
      baseURL: config.apiUrl,
      method: 'GET',
      // body: { ...formInputs },
      // onResponse({ request, response, options }) {
      //   console.log('QQQQQ', response._data)
      //   // Process the response data
      //   session.value = response._data
      //   return response._data
      // },
    })
    console.log('JJJJJJJ', data.value)
    session.value = data.value

    // await useSession()
    // return { session }
  }
  await getSession()

  return { session, getSession }
}

// export function useCsrfFetch(request, opts) {
//   const { csrf } = useCsrf()
//   opts = opts || {}
//   opts.headers = opts.headers || {}
//   opts.headers['csrf-token'] = csrf
//   // console.log("OPTS", opts)
//   return useFetch(request, opts)
// }
