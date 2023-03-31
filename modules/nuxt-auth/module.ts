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

const PACKAGE_NAME = 'nuxt-auth'
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
    methods: 'signup, signin, signout, verify, forgotPassword, resetPassword',
    basePath: '/api/v1/auth',
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
    configKey: 'nuxtAuth',
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
    nuxt.options.runtimeConfig.nuxtAuth = defu(nuxt.options.runtimeConfig.nuxtAuth, options)
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
    addServerHandler({ handler: resolve('runtime/server/middleware') })
    // addServerHandler({ handler: resolve('runtime/server/middleware/session') })

    // 4. Add composables
    addImportsDir(resolve('runtime/composables'))

    // addImports(
    //   ['useCsrf', 'useCsrfFetch'].map((key) => ({
    //     name: key,
    //     as: key,
    //     from: resolve('runtime/composables/useCsrf'),
    //   }))
    // )
    // 5. Add plugin
    addPlugin(resolve('runtime/plugin'))

    // // 4. Setup middleware, use `.unshift` to ensure (reasonably well) that the session middleware is firs
    // const serverHandler = {
    //   middleware: true,
    //   handler: resolve('./runtime/server/middleware/'),
    // }
    // nuxt.options.serverHandlers.unshift(serverHandler)

    // const url = joinURL(options.origin ?? '', options.api.basePath)
    // logger.info(`YRL Nuxt Auth API location is \`${url}\``)

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#auth'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/auth.d.ts',
      getContents: () =>
        [
          "declare module  '#auth' {",
          `  const createUser: typeof import('${resolve('./runtime/server/services')}').createUser`,
          // `  const fetchAuthUser: typeof import('${resolve('./runtime/server/services')}').fetchAuthUser`,
          `  const createUserSession: typeof import('${resolve('./runtime/server/services')}').createUserSession`,
          `  const updateUserSession: typeof import('${resolve('./runtime/server/services')}').updateUserSession`,
          `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
          `  const removeUserSession: typeof import('${resolve('./runtime/server/services')}').removeUserSession`,
          `  const createSessionKey: typeof import('${resolve('./runtime/server/services')}').createSessionKey`,
          `  const verifySessionKey: typeof import('${resolve('./runtime/server/services')}').verifySessionKey`,
          `  const checkPassword: typeof import('${resolve('./runtime/server/services')}').checkPassword`,
          `  const fetcheSessionUser: typeof import('${resolve('./runtime/server/services')}').fetcheSessionUser`,
          // `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/auth.d.ts') })
    })

    // 5. Register desired auth API endpoints
    if (options.api.isEnabled) {
      for (const apiMethod of options.api.methods.split(',').map((m) => m.trim())) {
        const handler = resolve(`./runtime/server/api/v1/auth/${apiMethod}.post`)
        addServerHandler({ handler, route: `${options.api.basePath}/${apiMethod}` })
      }
      logger.info(`Auth API "${options.api.methods}" endpoints registered at "${options.api.basePath}"`)
    }

    // addServerHandler({
    //   route: '/api/v1/session',
    //   handler: resolve('./runtime/server/api/v1/session/index.get'),
    // })

    // logger.info(`YRL Nuxt Auth API location is \`${options.api.basePath}\``)

    // From the runtime directory
    // addComponent({
    //   name: 'SignInForm', // name of the component to be used in vue templates
    //   // export: 'Products', // (optional) if the component is a named (rather than default) export
    //   filePath: resolve('runtime/components/SignInForm.vue'),
    // })

    // From the runtime directory
    // addComponent({
    //   name: 'signUpForm', // name of the component to be used in vue templates
    //   // export: 'Products', // (optional) if the component is a named (rather than default) export
    //   filePath: resolve('runtime/components/signUpForm.vue'),
    // })
    // if (options.session.api.isEnabled) {
    //   for (const apiMethod of options.session.api.methods) {
    //     logger.info(
    //       `YRL--- ./runtime/server${options.session.api.basePath}.${apiMethod}-----${options.session.api.basePath}`
    //     )
    //     addServerHandler({
    //       handler: resolve(`./runtime/server${options.session.api.basePath}.${apiMethod}`),
    //       route: options.session.api.basePath,
    //     })
    //   }
    //   logger.info(
    //     `Session API "${options.session.api.methods.join(', ')}" endpoints registered at "${
    //       options.session.api.basePath
    //     }"`
    //   )
    // } else {
    //   logger.info('Session API disabled')
    // }

    // 4. Add composables
    // addImportsDir(resolve('./runtime/composables'))

    // 5. Add CSRF middleware
    // addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })

    // 6. Add plugin for initial load
    // addPlugin(resolve('./runtime/plugin'))

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

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
