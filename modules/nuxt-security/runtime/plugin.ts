export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()
  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  if ('_csrftoken' in res) nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
})
