import { useNuxtApp, useFetch } from '#app'

import type { FetchError } from 'ofetch'
import type { NitroFetchRequest, AvailableRouterMethod } from 'nitropack'
import type { Ref } from 'vue'
import type { KeyOfRes, AsyncData, PickFrom } from 'nuxt/dist/app/composables/asyncData'
import type { FetchResult, UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

export function useCsrf() {
  const nuxtApp = useNuxtApp()
  console.log('OOOOOO', nuxtApp.payload)
  if (process.server) {
    const res = nuxtApp.ssrContext?.event.node.res ?? {}
    if ('_csrftoken' in res) {
      nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
    }
  }
  return { csrf: nuxtApp.payload.csrfToken }
}

export function useCsrfFetch(request, opts) {
  const { csrf } = useCsrf()

  opts = opts || {}
  opts.headers = opts.headers || {}
  opts.headers['csrf-token'] = csrf // add csrftoken to req headers
  console.log('LLLLLLL', opts)

  return {}

  return useFetch(request, opts)
}
