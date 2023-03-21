import {
  defineNuxtModule,
  useLogger,
  createResolver,
  addImportsDir,
  addPlugin,
  addComponent,
  addServerHandler,
} from '@nuxt/kit'
import { defu } from 'defu'
import { joinURL } from 'ufo'
import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'nuxt-auth'
const defaults = {
  isEnabled: true,
  csrfCookieKey: 'csrf',
  csrfCookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
  },
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
    configKey: 'nuxtAuth',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },

  defaults,
  hooks: {},
  setup(moduleOptions, nuxt) {
    // Initializelogger
    const logger = useLogger(PACKAGE_NAME)
    // logger.info(nuxt)

    // 1. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }
    logger.info('`nuxt-auth` setup starting')

    // 2. Set up runtime configuration
    const options = defu(moduleOptions, {
      ...defaults,
    })
    const url = joinURL(options.origin ?? '', options.basePath)
    logger.info(`Auth API location is \`${url}\``)

    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.auth = defu(nuxt.options.runtimeConfig.auth, options)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Add nuxt-auth composables
    const composables = resolve('./runtime/composables')
    addImportsDir(composables)

    // Add signin component
    addComponent({
      name: 'SignIn', // name of the component to be used in vue templates
      // export: 'Products', // (optional) if the component is a named (rather than default) export
      filePath: resolve('runtime/components/signin.vue'),
    })

    // Add middleware
    addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })

    // Add an API route
    addServerHandler({
      route: '/api/v2/auth/signin',
      handler: resolve('./runtime/server/api/v1/signin'),
    })

    // 6. Add plugin for initial load
    addPlugin(resolve('./runtime/plugin'))
  },
})
