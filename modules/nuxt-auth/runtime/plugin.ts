export default defineNuxtPlugin((nuxtApp) => {
  console.log('Hello from Auth Plugin')
  // console.log('Hello from Mailer module plugin', nuxtApp.ssrContext?.event.node.res ?? {})
  // console.log('Hello from Mailer module plugin', nuxtApp.ssrContext?.event.node.res ?? {})
  return {
    provide: {
      // hello: (msg: string) => `Hello ${msg}!`,
    },
  }
})
