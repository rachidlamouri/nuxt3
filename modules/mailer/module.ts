// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import defu from 'defu'
import { resolve, join } from 'pathe'

import {
  createResolver,
  defineNuxtModule,
  addServerHandler,
  addPlugin,
  addImportsDir,
  addTemplate,
  addComponent,
  addImports,
} from 'nuxt/kit'
export default defineNuxtModule({
  meta: {
    name: '@yrl/nuxt-mailer',
    configKey: 'mailer',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },
  defaults: { addModulePlugin: false, mailTransporter: 'sendgrid' },
  hooks: {},
  setup(options, nuxt) {
    console.log('MMMMMMM', options, options.addModulePlugin === true)
    const { resolve } = createResolver(import.meta.url)

    // From the runtime directory
    addComponent({
      name: 'ContactForm', // name of the component to be used in vue templates
      // export: 'Products', // (optional) if the component is a named (rather than default) export
      filePath: resolve('runtime/components/ContactForm.vue'),
    })

    // Add an API route
    addServerHandler({
      route: '/api/mailer/sendmail',
      handler: resolve('./runtime/server/services/sendmail'),
    })

    // nuxt.hook('autoImports:dirs', (dirs) => {
    //   console.log(dirs)
    //   dirs.push(resolve(__dirname, './runtime/composables'))
    // })
    addImportsDir(resolve('runtime/composables'))

    nuxt.options.runtimeConfig.mailer = defu(nuxt.options.runtimeConfig.mailer, {
      mailTransporter: options.mailTransporter,
    })

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#mailer'] = resolve('./runtime/server/services')
    })

    addTemplate({
      filename: 'types/mailer.d.ts',
      getContents: () =>
        [
          "declare module  '#mailer' {",
          `  const sendMail: typeof import('${resolve('./runtime/server/services')}').sendMail`,
          // `  const getToken: typeof import('${resolve('./runtime/server/services')}').getToken`,
          // `  const NuxtAuthHandler: typeof import('${resolve('./runtime/server/services')}').NuxtAuthHandler`,
          '}',
        ].join('\n'),
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/mailer.d.ts') })
    })
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
    if (options.addModulePlugin) addPlugin(resolve('./runtime/plugin'))
  },
})
