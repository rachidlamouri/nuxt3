import {
  defineNuxtModule,
  useLogger,
  createResolver,
  addImportsDir,
  addPlugin,
  addComponent,
  addServerHandler,
  addImports,
} from '@nuxt/kit'
import { defu } from 'defu'
import { joinURL } from 'ufo'
import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'yrl-nuxt-auth'
const defaults = {
  isEnabled: true,
  csrfCookieKey: 'csrf',
  csrfCookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  },
  methodsToProtect: ['POST', 'PUT', 'PATCH'],
  excludedUrls: [],
  csrfEncryptAlgorithm: 'aes-256-cbc',
  encryptSecret: randomBytes(22).toString('base64'),
  origin: process.env.NODE_ENV === 'production' ? 'https://yrl-consulting.com' : 'http://localhost:3000',
  basePath: '/api/auth',
  trustHost: false,
  enableSessionRefreshPeriodically: false,
  enableSessionRefreshOnWindowFocus: true,
  enableGlobalAppMiddleware: false,
  defaultProvider: undefined,
  addDefaultCallbackUrl: true,
  globalMiddlewareOptions: {
    allow404WithoutAuth: true,
    addDefaultCallbackUrl: true,
  },
}

export default defineNuxtModule({
  meta: {
    name: PACKAGE_NAME,
    configKey: 'yrlNuxtAuth',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },

  defaults,
  hooks: {},
  setup(moduleOptions, nuxt) {
    // Initializelogger
    const logger = useLogger(PACKAGE_NAME)

    // 1. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }
    logger.info(`${PACKAGE_NAME} module setup starting`)

    // 2. Set up runtime configuration
    const options = defu(moduleOptions, defaults)
    const url = joinURL(options.origin ?? '', options.basePath)
    logger.info(`YRL Nuxt Auth API location is \`${url}\``)

    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.yrlNuxtAuth = defu(nuxt.options.runtimeConfig.yrlNuxtAuth, options)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Add nuxt-auth composables
    addImportsDir(resolve('./runtime/composables'))

    // 5. Add CSRF middleware
    addServerHandler({ handler: resolve('runtime/server/middleware') })

    // 6. Add plugin for initial load
    addPlugin(resolve('./runtime/plugin'))

    // Add an API route
    // addServerHandler({
    //   route: '/api/v2/auth/signin',
    //   handler: resolve('./runtime/server/api/v1/signin'),
    // })

    // Add signin component
    // addComponent({
    //   name: 'SignIn', // name of the component to be used in vue templates
    //   // export: 'Products', // (optional) if the component is a named (rather than default) export
    //   filePath: resolve('runtime/components/signin.vue'),
    // })

    // nuxt.options.build.transpile.push(resolve('runtime'))

    // addImports(
    //   ['useCsrf', 'useCsrfFetch'].map((key) => ({
    //     name: key,
    //     as: key,
    //     from: resolve('runtime/composables'),
    //   }))
    // )
  },
})
