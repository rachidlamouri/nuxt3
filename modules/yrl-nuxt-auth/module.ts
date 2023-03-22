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

const PACKAGE_NAME = 'nuxt-auth'
const defaults = {
  isEnabled: true,
  session: {
    cookieName: 'sessionId',
    expiryInSeconds: 60 * 10,
    idLength: 64,
    storePrefix: 'sessions',
    cookieSameSite: 'lax',
    cookieSecure: true,
    cookieHttpOnly: true,
    storageOptions: {
      driver: 'memory',
      options: {},
    },
    domain: false,
    ipPinning: false,
    rolling: false,
    api: {
      isEnabled: true,
      methods: ['patch', 'get', 'post', 'delete'],
      basePath: '/api/session',
    },
  },

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
  xssValidator: {
    whiteList: {
      a: [],
    },
    stripIgnoreTag: true,
    throwError: false, // optional
  },
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
    name: `@YRL/${PACKAGE_NAME}`,
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
    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 2. Set up runtime configuration
    const options = defu(moduleOptions, defaults)
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.yrlNuxtAuth = defu(nuxt.options.runtimeConfig.yrlNuxtAuth, options)
    const url = joinURL(options.origin ?? '', options.basePath)
    logger.info(`YRL Nuxt Auth API location is \`${url}\``)

    // Setup unstorage
    //
    //
    //

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware, use `.unshift` to ensure (reasonably well) that the session middleware is first
    const serverHandler = {
      middleware: true,
      handler: resolve('./runtime/server/middleware/session'),
    }
    nuxt.options.serverHandlers.unshift(serverHandler)

    // 5. Register desired session API endpoints
    if (options.session.api.isEnabled) {
      for (const apiMethod of options.session.api.methods) {
        addServerHandler({
          handler: resolve(`./runtime/server/api/session/index.${apiMethod}`),
          route: options.session.api.basePath,
        })
      }
      logger.info(
        `Session API "${options.session.api.methods.join(', ')}" endpoints registered at "${
          options.session.api.basePath
        }"`
      )
    } else {
      logger.info('Session API disabled')
    }

    // 4. Add composables
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

    logger.success('Session setup complete')
  },
})
