import { $fetch } from 'ofetch'
import { defineNuxtPlugin, useCsrf } from '#imports'
export default defineNuxtPlugin(() => {
  const { csrf } = useCsrf()
  console.log('Plugin', csrf)
  return {
    provide: {
      csrfFetch: (request, options, fetch = $fetch) => {
        if (!options) {
          options = {}
        }
        options.headers = options.headers || {}
        options.headers['csrf-token'] = csrf
        return fetch(request, options)
      },
      xustCsrf: csrf,
    },
  }
})
