import {
  defineNuxtModule,
  useLogger,
  createResolver,
  addImportsDir,
  addPlugin,
  addComponent,
  addServerHandler,
  addImports,
  addTemplate,
} from '@nuxt/kit'
import { defu } from 'defu'
import { joinURL } from 'ufo'
import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'nuxt-commerce'
const defaults = {
  isEnabled: true,
  sessionCookieName: 'userSID',
  cookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    expiryInSeconds: 10 * 60,
  },
  encryptSecret: randomBytes(22).toString('base64'),
  // sessionExpiryInSeconds: 60 * 10,
  api: {
    isEnabled: true,
    methods: 'get',
    basePath: '/api/v1/products',
  },
  csrf: {
    isEnabled: true,
    https: process.env.NODE_ENV === 'production',
    cookieKey: 'csrf',
    cookieOpts: {
      path: '/',
      httpOnly: true,
      // sameSite: 'strict',
      secure: false,
    },
    methodsToProtect: ['GET', 'POST', 'PUT', 'PATCH'],
    // excludedUrls: [],
    encryptSecret: randomBytes(22).toString('base64'),
    encryptAlgorithm: 'aes-256-cbc',
  },
  xss: {
    whiteList: {
      a: [],
    },
    stripIgnoreTag: true,
    throwError: false, // optional
  },
  jwtSecret: randomBytes(22).toString('base64'),
  session: {
    cookieKey: 'userSID',
    isEnabled: true,
    expiryInSeconds: 60 * 10,
    userSessionId: 'userSID',
    cartSessionId: 'cartSID',
    idLength: 64,
    storePrefix: 'sessions',
    // cookieSameSite: 'strict',
    cookieSecure: false,
    cookieHttpOnly: true,
    storageOptions: {
      driver: 'memory',
      options: {},
    },
    // domain: 'yrl-consulting.com',
    ipPinning: false,
    rolling: false,
    api: {
      isEnabled: true,
      methods: ['patch', 'delete', 'get', 'post'],
      basePath: '/api/v1/session',
    },
  },

  // csrfCookieKey: 'csrf',
  // csrfCookieOpts: {
  //   path: '/',
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   secure: false,
  // },
  // methodsToProtect: ['POST', 'PUT', 'PATCH'],
  excludedUrls: [],
  csrfEncryptAlgorithm: 'aes-256-cbc',
  encryptSecret: randomBytes(22).toString('base64'),
  // xssValidator: {
  //   whiteList: {
  //     a: [],
  //   },
  //   stripIgnoreTag: true,
  //   throwError: false, // optional
  // },
  origin: process.env.NODE_ENV === 'production' ? 'https://yrl-consulting.com' : 'http://localhost:3000',
  // basePath: '/api/v1/auth',
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
    configKey: 'nuxtCommerce',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },

  defaults,
  hooks: {},
  setup(moduleOptions, nuxt) {
    // 1. Initializelogger
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
    nuxt.options.runtimeConfig.nuxtCommerce = defu(nuxt.options.runtimeConfig.nuxtCommerce, options)
    nuxt.options.runtimeConfig.public.nuxtAuth = defu(nuxt.options.runtimeConfig.public.nuxtAuth, {
      session: {
        api: options.session.api,
        userSessionId: options.session.userSessionId,
        cartSessionId: options.session.cartSessionId,
      },
    })
    // nuxt.options.runtimeConfig.public.nuxtAuth = defu(nuxt.options.runtimeConfig.public.nuxtAuth, options)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)
    // 4. Setup middleware,
    // addServerHandler({ handler: resolve('runtime/server/middleware') })
    // addServerHandler({ handler: resolve('runtime/server/middleware/session') })

    // 4. Add composables
    // addImportsDir(resolve('runtime/composables'))

    // 5. Add plugin
    // addPlugin(resolve('runtime/plugin'))

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#commerce'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/commerce.d.ts',
      getContents: () =>
        [
          "declare module  '#commerce' {",
          `  const createProduct: typeof import('${resolve('./runtime/server/services')}').createProduct`,
          `  const createManyProducts: typeof import('${resolve('./runtime/server/services')}').createManyProducts`,

          // `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/commerce.d.ts') })
    })

    // 5. Register desired auth API endpoints
    if (options.api.isEnabled) {
      for (const apiMethod of options.api.methods.split(',').map((m) => m.trim())) {
        const handler = resolve(`./runtime/server/api/v1/products/index.${apiMethod}`)
        addServerHandler({ handler, route: `${options.api.basePath}` })
      }
      logger.info(`Commerce API "${options.api.methods}" endpoints registered at "${options.api.basePath}"`)

      addServerHandler({
        handler: resolve(`./runtime/server/api/v1/products/migrate.post`),
        route: `${options.api.basePath}/migrate`,
      })
      logger.info(`Commerce API "migrate.post" endpoint registered at "${options.api.basePath}/migrate"`)
    }

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
