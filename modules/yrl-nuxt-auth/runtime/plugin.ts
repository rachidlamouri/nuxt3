// import { defineNuxtPlugin, useCsrf } from '#imports'
export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  // const { csrf } = useCsrf()
  console.log('PluginCSRF', nuxtApp.ssrContext?.event.node.res._csrftoken)
  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client

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
