// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import defu from 'defu'
import { resolve, join } from 'pathe'

import { createResolver, defineNuxtModule, addServerHandler, addPlugin, addImportsDir, addImports } from 'nuxt/kit'
export default defineNuxtModule({
  meta: {
    name: 'mailer',
  },
  setup(options, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)
    addPlugin(resolve('./runtime/plugin'))
    // Add an API route
    addServerHandler({
      route: '/api/hello',
      handler: resolve('./runtime/api-route'),
    })

    // nuxt.hook('autoImports:dirs', (dirs) => {
    //   console.log(dirs)
    //   dirs.push(resolve(__dirname, './runtime/composables'))
    // })
    addImportsDir(resolve('runtime/composables'))
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
  },
})
