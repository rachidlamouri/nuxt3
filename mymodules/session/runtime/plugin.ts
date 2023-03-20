// import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin((nuxtApp) => {
  // console.log('Session Plugin', useRuntimeConfig())
  // console.log('Hello from Mailer module plugin', nuxtApp.ssrContext?.event.node.res ?? {})
  // console.log('Hello from Mailer module plugin', nuxtApp.ssrContext?.event.node.res ?? {})
  return {
    provide: {
      // hello: (msg: string) => `Hello ${msg}!`,
    },
  }
})
