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

const PACKAGE_NAME = 'session'

const defaults = {
  isEnabled: true,
  session: {
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
  },
  api: {
    isEnabled: true,
    methods: ['patch', 'delete', 'get', 'post'],
    basePath: '/api/session',
  },
}

export default defineNuxtModule({
  meta: {
    name: '@yrl/nuxt-session',
    configKey: 'session',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },
  defaults,

  hooks: {},

  setup(moduleOptions, nuxt) {
    // console.log('MMMMMMMVVVVVVV', moduleOptions)

    const logger = useLogger(PACKAGE_NAME)

    // 1. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }

    logger.info('Setting up sessions...')

    // 2. Set public and private runtime configuration
    nuxt.options.runtimeConfig.session = defu(nuxt.options.runtimeConfig.session, moduleOptions)
    nuxt.options.runtimeConfig.public.session = defu(nuxt.options.runtimeConfig.public.session, {
      api: moduleOptions.api,
    })

    // setup unstorage
    // nuxt.options.nitro.virtual = defu(nuxt.options.nitro.virtual, {
    //   '#session-driver': `export { default } from '${
    //     builtinDrivers[options.session.storageOptions.driver]
    //   }'`
    // })

    // 3. Locate runtime directory and transpile module
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware, use `.unshift` to ensure (reasonably well) that the session middleware is first
    const handler = resolve('./runtime/server/middleware/session')
    const serverHandler = {
      middleware: true,
      handler,
    }
    nuxt.options.serverHandlers.unshift(serverHandler)

    // 5. Register desired session API endpoints
    if (moduleOptions.api.isEnabled) {
      for (const apiMethod of moduleOptions.api.methods) {
        const handler = resolve(`./runtime/server/api/session.${apiMethod}`)
        addServerHandler({ handler, route: moduleOptions.api.basePath })
      }
      logger.info(
        `Session API "${moduleOptions.api.methods.join(', ')}" endpoints registered at "${moduleOptions.api.basePath}"`
      )
    } else {
      logger.info('Session API disabled')
    }

    // 6. Add nuxt-session composables
    addImportsDir(resolve('./runtime/composables'))

    logger.success('Session setup complete')

    addPlugin(resolve('./runtime/plugin'))
  },
})
