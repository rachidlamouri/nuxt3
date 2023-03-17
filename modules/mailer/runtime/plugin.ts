// import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin((nuxtApp) => {
  console.log('Hello from Mailer module plugin')
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  }
})
