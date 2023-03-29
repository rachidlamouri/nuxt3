// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import defu from 'defu'
// import { resolve, join } from 'pathe'
// import { RuntimeConfig } from '@nuxt/schema'
import { builtinDrivers } from 'unstorage'

import {
  createResolver,
  defineNuxtModule,
  addServerHandler,
  addPlugin,
  addImportsDir,
  addTemplate,
  addComponent,
  addImports,
  useLogger,
} from 'nuxt/kit'

const PACKAGE_NAME = 'nuxt-session'

const defaults = {
  isEnabled: true,
  expiryInSeconds: 60 * 10,
  userSessionId: 'userSession',
  cartSessionId: 'cartSession',
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
}

export default defineNuxtModule({
  meta: {
    name: `@YRL/${PACKAGE_NAME}`,
    configKey: 'nuxtSession',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },
  defaults,

  hooks: {},

  setup(moduleOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME)

    // 1. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }

    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 2. Set public and private runtime configuration
    const options = defu(moduleOptions, defaults)
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.nuxtSession = defu(nuxt.options.runtimeConfig.nuxtSession, options)
    nuxt.options.runtimeConfig.public.nuxtSession = defu(nuxt.options.runtimeConfig.public.nuxtSession, {
      api: options.api,
      userSessionId: options.userSessionId,
      cartSessionId: options.cartSessionId,
    })

    // setup unstorage
    // nuxt.options.nitro.virtual = defu(nuxt.options.nitro.virtual, {
    //   '#session-driver': `export { default } from '${
    //     builtinDrivers[options.session.storageOptions.driver]
    //   }'`
    // })

    // 3. Locate runtime directory and transpile module
    const { resolve } = createResolver(import.meta.url)
    // 5. Add composbales
    addImportsDir(resolve('runtime/composables'))

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#session'] = resolve('./runtime/server/services')
      // nitroConfig.alias['#emailTemplates'] = resolve('./runtime/email-templates')
    })
    addTemplate({
      filename: 'types/session.d.ts',
      getContents: () =>
        [
          "declare module  '#session' {",
          `  const setUserSession: typeof import('${resolve('./runtime/server/services')}').setUserSession`,
          `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
          `  const storage: typeof import('${resolve('./runtime/server/services')}').storage`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/session.d.ts') })
    })

    addServerHandler({
      handler: resolve(`./runtime/server/api/v1/session/index.get`),
      route: '/api/v1/session',
    })

    // 4. Setup middleware, use `.unshift` to ensure (reasonably well) that the session middleware is first
    // const handler = resolve('./runtime/server/middleware/session')
    // const serverHandler = {
    //   middleware: true,
    //   handler,
    // }
    // nuxt.options.serverHandlers.unshift(serverHandler)

    // 5. Register desired session API endpoints
    // if (moduleOptions.api.isEnabled) {
    //   for (const apiMethod of moduleOptions.api.methods) {
    //     const handler = resolve(`./runtime/server/api/v1/session/session.${apiMethod}`)
    //     addServerHandler({ handler, route: `${moduleOptions.api.basePath}/session.${apiMethod}` })
    //   }
    //   logger.info(
    //     `Session API "${moduleOptions.api.methods.join(', ')}" endpoints registered at "${moduleOptions.api.basePath}"`
    //   )
    // } else {
    //   logger.info('Session API disabled')
    // }

    // 6. Add nuxt-session composables
    // addImportsDir(resolve('./runtime/composables'))

    logger.success('Session setup complete')

    // addPlugin(resolve('./runtime/plugin'))
  },
})
