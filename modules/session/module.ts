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
    // const options = defu(, defaults)
    // const publicConfig = { session: }
    // if (moduleOptions.api.methods && moduleOptions.api.methods.length > 0) {
    //   options.api.methods = moduleOptions.api.methods
    // } else {
    //   options.api.methods = ['patch', 'delete', 'get', 'post']
    // }
    nuxt.options.runtimeConfig.session = defu(nuxt.options.runtimeConfig.session, moduleOptions)
    nuxt.options.runtimeConfig.public.session = defu(nuxt.options.runtimeConfig.public.session, {
      api: moduleOptions.api,
    })

    // 3. Locate runtime directory and transpile module
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware, use `.unshift` to ensure (reasonably well) that the session middleware is first
    const handler = resolve('./runtime/server/middleware/session')
    const serverHandler = {
      middleware: true,
      handler,
    }
    nuxt.options.serverHandlers.unshift(serverHandler)

    // // Setup unstorage
    // nuxt.options.nitro.virtual = defu(nuxt.options.nitro.virtual, {
    //   '#session-driver': `export { default } from '${builtinDrivers[options.session.storageOptions.driver]}'`,
    // })

    // From the runtime directory
    // addComponent({
    //   name: 'ContactFormxxxxx', // name of the component to be used in vue templates
    //   // export: 'Products', // (optional) if the component is a named (rather than default) export
    //   filePath: resolve('runtime/components/ContactForm.vue'),
    // })

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

    // addServerHandler({
    //   route: '/api/mailer/sendmail',
    //   handler: resolve('./runtime/server/services/sendContactFormMail'),
    // })

    // nuxt.hook('autoImports:dirs', (dirs) => {
    //   console.log(dirs)
    //   dirs.push(resolve(__dirname, './runtime/composables'))
    // })
    // addImportsDir(resolve('runtime/composables'))

    // // 5. Create virtual imports for server-side
    // nuxt.hook('nitro:config', (nitroConfig) => {
    //   nitroConfig.alias = nitroConfig.alias || {}

    //   // Inline module runtime in Nitro bundle
    //   nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
    //     inline: [resolve('./runtime')],
    //   })
    //   nitroConfig.alias['#mailer'] = resolve('./runtime/server/services')
    // })

    // addTemplate({
    //   filename: 'types/mailer.d.ts',
    //   getContents: () =>
    //     [
    //       "declare module  '#mailer' {",
    //       `  const sendMail: typeof import('${resolve('./runtime/server/services')}').sendMail`,
    //       // `  const getToken: typeof import('${resolve('./runtime/server/services')}').getToken`,
    //       // `  const NuxtAuthHandler: typeof import('${resolve('./runtime/server/services')}').NuxtAuthHandler`,
    //       '}',
    //     ].join('\n'),
    // })

    // nuxt.hook('prepare:types', (moduleOptions) => {
    //   moduleOptions.references.push({ path: resolve(nuxt.options.buildDir, 'types/mailer.d.ts') })
    // })
    // addImports({
    //   name: 'useHello', // name of the composable to be used
    //   as: 'useHello',
    //   from: resolver.resolve('runtime/composables/useHello'), // path of composable
    // })

    // nuxt.hook('nitro:config', (nitroConfig) => {
    //   nitroConfig.alias = nitroConfig.alias || {}
    //   nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
    //     inline: [resolve('./runtime')],
    //   })
    //   nitroConfig.alias['#useHello'] = resolve('./runtime/composables')
    // })

    //Add plugin for initial load
    addPlugin(resolve('./runtime/plugin'))
  },
})
