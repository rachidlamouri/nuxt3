// import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin((nuxtApp) => {
  console.log('JJJJJJJJJJJ')

  //   console.log('plugin', nuxtApp)

  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
    },
  }
})
