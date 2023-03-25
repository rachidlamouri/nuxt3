import defu from 'defu'

import {
  createResolver,
  defineNuxtModule,
  addServerHandler,
  addPlugin,
  addImportsDir,
  addTemplate,
  addComponent,
  useLogger,
} from 'nuxt/kit'

const PACKAGE_NAME = 'nuxt-mail'

const defaults = {
  isEnabled: true,
  apiBasePath: 'api/v1/mailer',
  mailTransporter: 'sendgrid',
  contactFormEmailRecipients: 'abbaslamouri@yrlus.com, lamouri@genvac.com',
  emailFromName: 'YRL Consulting, LLC',
  emailFromEmail: 'support@yrlus.com',
  emailSentMessage: 'Your message was sent successfully',
  contactFormEmailSubject: 'New message from yrl-consulting.com site',
  registrationEmailSubject: 'Please confirm your email address',
  forgotPasswordEmailSubject: 'Your password reset token (valid for 1 hour)',
}

export default defineNuxtModule({
  meta: {
    name: `@YRL/${PACKAGE_NAME}`,
    configKey: 'nuxtMailer',
    compatibility: {
      nuxt: '^3.3.1',
    },
  },
  defaults,
  hooks: {},

  setup(moduleOptions, nuxt) {
    // 1. Initializelogger
    const logger = useLogger(PACKAGE_NAME)

    // 2. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }
    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 3. Set up runtime configuration
    const options = defu(moduleOptions, defaults)
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.nuxtMailer = defu(nuxt.options.runtimeConfig.nuxtMailer, options)
    nuxt.options.runtimeConfig.public.nuxtMailer = defu(nuxt.options.runtimeConfig.public.nuxtMailer, {
      emailSentMessage: options.emailSentMessage,
    })
    // nuxt.options.runtimeConfig.public.nuxtMailer = defu(nuxt.options.runtimeConfig.public.nuxtMailer, options)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // From the runtime directory
    // addComponent({
    //   name: 'ContactForm', // name of the component to be used in vue templates
    //   // export: 'Products', // (optional) if the component is a named (rather than default) export
    //   filePath: resolve('runtime/components/ContactForm.vue'),
    // })

    // 4. Add  API route
    // 5. Register desired auth API endpoints
    logger.info(`${PACKAGE_NAME} API location is \`/${options.apiBasePath}\``)

    addServerHandler({
      handler: resolve(`./runtime/server/${options.apiBasePath}/sendMail.post`),
      route: `/${options.apiBasePath}/sendMail`,
    })

    // addServerHandler({
    //   route: '/api/mailer/sendmail',
    //   handler: resolve('./runtime/server/services/sendContactFormMail'),
    // })

    // 5. Add composbales
    addImportsDir(resolve('runtime/composables'))

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#mailer'] = resolve('./runtime/server/services')
      // nitroConfig.alias['#emailTemplates'] = resolve('./runtime/email-templates')
    })
    addTemplate({
      filename: 'types/mailer.d.ts',
      getContents: () =>
        [
          "declare module  '#mailer' {",
          `  const sendMail: typeof import('${resolve('./runtime/server/services')}').sendMail`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/mailer.d.ts') })
    })

    // addTemplate({
    //   filename: 'types/emailTemplates.d.ts',
    //   getContents: () =>
    //     [
    //       "declare module  '#emailTemplates' {",
    //       `  const base: typeof import('${resolve('./runtime/emailemplates')}').base`,
    //       '}',
    //     ].join('\n'),
    // })
    // nuxt.hook('prepare:types', (options) => {
    //   options.references.push({ path: resolve(nuxt.options.buildDir, 'types/emailTemplates.d.ts') })
    // })

    //Add plugin for initial load
    // if (options.addModulePlugin) addPlugin(resolve('./runtime/plugin'))
  },
})
