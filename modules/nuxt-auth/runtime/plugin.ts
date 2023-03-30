// import { defineNuxtPlugin, useCsrf } from '#imports'
import { storage } from '../../../mymodules/session/index'
export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()
  // const { authUser } = useAuthStore()
  // const { session } = await useSession()

  // if (process.client) {
  //   console.log('IIIIII', session.value)
  //   authUser.value.isAuthenticated = session.value.isAuthenticated
  //   authUser.value.userName = session.value.userName
  // }
  // const { csrf } = useCsrf()
  console.log('PluginCSRFXXXXXXXXXXXXXXZZZZZZZ', nuxtApp.ssrContext?.event.node.res._csrftoken)
  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
  if ('_session' in res) nuxtApp.payload.session = res._session // expose csrftoken to client
  if (process.server) {
    // console.log('NUXTAPP', nuxtApp.ssrContext.event.context)
    // nuxtApp.payload.sessionMeta = nuxtApp.ssrContext.event.context.sessionMeta
  }
  provide: {
    sessionMeta: nuxtApp.payload.sessionMeta
  }
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
