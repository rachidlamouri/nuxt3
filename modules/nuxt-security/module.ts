import { randomBytes } from 'crypto'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addServerHandler, addImports, addPlugin, useLogger } from '@nuxt/kit'

const PACKAGE_NAME = 'nuxt-security'

export default defineNuxtModule({
  meta: {
    name: `@YRL/${PACKAGE_NAME}`,
    configKey: 'nuxtSecurity',
  },
  defaults: {
    csrf: {
      isEnabled: true,
      https: process.env.NODE_ENV === 'production',
      cookieKey: 'csrf',
      cookieOpts: {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
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
  },
  setup(moduleOptions, nuxt) {
    // 1. Initialize logger
    const logger = useLogger(PACKAGE_NAME)

    // 1. Check if module should be enabled at all
    if (!moduleOptions.csrf.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, module is disabled`)
      return
    }
    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 2. Set up runtime configuration
    nuxt.options.runtimeConfig.nuxtSecurity = defu(nuxt.options.runtimeConfig.nuxtSecurity, moduleOptions)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware,
    addServerHandler({ handler: resolve('runtime/server/middleware/') })

    // 4. Add composables
    addImports(
      ['useCsrf', 'useCsrfFetch'].map((key) => ({
        name: key,
        as: key,
        from: resolve('runtime/composables'),
      }))
    )
    // 5. Add plugin
    addPlugin(resolve('runtime/plugin'))
  },
})
