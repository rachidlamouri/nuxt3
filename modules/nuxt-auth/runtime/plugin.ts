// import { defineNuxtPlugin, useCsrf } from '#imports'
import { storage } from '../../../mymodules/session/index'
export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()

  // const { authUser } = useAuthStore()
  // const { session } = await useSession()
  // console.log('PPPPPXXXXXX', useCookie('userSID').value)

  // if (process.client) {
  //   console.log('IIIIII', session.value)
  //   authUser.value.isAuthenticated = session.value.isAuthenticated
  //   authUser.value.userName = session.value.userName
  // }
  // const { csrf } = useCsrf()
  // console.log('PluginCSRFXXXXXXXXXXXXXXZZZZZZZ', nuxtApp.ssrContext?.event.node.res._csrftoken)
  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  // if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
  if ('_csrfToken' in res) nuxtApp.payload.csrfToken = res._csrfToken // expose csrftoken to client
  if ('_userSession' in res) nuxtApp.payload.userSession = res._userSession // expose csrftoken to client
  if (process.server) {
    // console.log('NUXTAPP', nuxtApp.payload.userSession)
    // nuxtApp.payload.sessionMeta = nuxtApp.ssrContext.event.context.sessionMeta
  }

  // provide: {
  //   sessionMeta: nuxtApp.payload.sessionMeta
  // }

  addRouteMiddleware('auth', async (to) => {
    // console.log('NUXT', nuxtApp.payload)
    console.log(
      'this named middleware was added in a plugin and would override any existing middleware of the same name'
    )

    // const { data, pending, error, refresh } = await useCsrfFetch('session', {
    //   baseURL: config.apiUrl,
    //   method: 'GET',
    // })
    // console.log(data.value)

    // const { authenticated } = useAuthStore(

    // if (
    //   (!nuxtApp.payload || !nuxtApp.payload.sessionUser || !nuxtApp.payload.sessionUser.authenticated) &&
    //   to.name === 'admin-users'
    // )
    //   return navigateTo('/auth/signin')

    // return abortNavigation()
    // createError({
    //   statusCode: 404,
    //   message: 'The route could not be found :(',
    // })
  })
  // console.log('Meta', await storage.getMeta()

  // console.log('Pluginzzzz', useNuxtApp().ssrContext?.event.node.res._csrftoken)

  // return {
  //   provide: {
  //     csrfFetch: (request:string, options, fetch = $fetch) => {
  //       if (!options) {
  //         options = {}
  //       }
  //       options.headers = options.headers || {}
  //       options.headers['csrf-token'] = csrf
  //       return fetch(request, options)
  //     },
  //   },
  // }
})
