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
  const session = ref()
  session.value = { isAuthenticated: false, userName: '' }
  // console.log('NNNNN', config.public.yrlNuxtAuth)
  // const sessionOptions = config.public.yrlNuxtAuth.session
  // const session = ref()
  // console.log('PPPPPP', sessionOptions.api.basePath)

  // const _sessionRequest = (method, body) => {
  const getSession = async () => {
    // const opts = { method: method.toUpperCase(), body }

    const { data } = useCsrfFetch('session', {
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

    if (data.value && Object.keys(data.value).length) session.value = data.value
    console.log('JJJJJJJ', session.value)
    // await useSession()
    // return { session }
  }
  await getSession()
  console.log('ZZZZZZZZXXXXXXX', session.value)

  // const isAuthenticated = computed(() => session.value.isAuthenticated)
  // const userName = computed(() => session.value.userName)
  // console.log('ZZZZZZZZXXXXXXXYYYYYY', isAuthenticated.value)

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
