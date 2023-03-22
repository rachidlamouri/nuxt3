import { randomBytes } from 'crypto'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addServerHandler, addImports, addPlugin } from '@nuxt/kit'

const module = defineNuxtModule({
  meta: {
    name: 'nuxt-csrf',
    configKey: 'nuxtCsrf',
  },
  defaults: {
    https: process.env.NODE_ENV === 'production',
    cookieKey: '',
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    },
    methodsToProtect: ['POST', 'PUT', 'PATCH'],
    excludedUrls: [],
    encryptSecret: randomBytes(22).toString('base64'),
    encryptAlgorithm: 'aes-256-cbc',
  },
  setup(options, nuxt) {
    console.log('Modulexxxxx')
    const { resolve } = createResolver(import.meta.url)
    if (!options.cookieKey) {
      options.cookieKey = `${options.https ? '__Host-' : ''}csrf`
    }
    options.cookie = options.cookie || {}
    if (options.cookie.secure === void 0) {
      options.cookie.secure = !!options.https
    }
    nuxt.options.runtimeConfig.csurf = defu(nuxt.options.runtimeConfig.csurf, options)

    addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })
    nuxt.options.build.transpile.push(resolve('runtime'))
    addImports(
      ['useCsrf', 'useCsrfFetch'].map((key) => ({
        name: key,
        as: key,
        from: resolve('runtime/composables'),
      }))
    )

    addPlugin(resolve('runtime/plugin'))
  },
})

export { module as default }
