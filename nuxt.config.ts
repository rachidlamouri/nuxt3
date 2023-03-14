// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  modules: ['@nuxt/content', ['./modules/mongodb', {}]],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['UseFetchDemo'].includes(tag),
    },
  },
  components: {
    global: true,
    dirs: ['~/components'],
  },
  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      preload: ['javascript', 'vue', 'html'],
      theme: 'monokai',
    },
  },
  runtimeConfig: {
    dbUrl: '',
    jwtSecret: '',
    jwtMaxAge: '',
    jwtSignupTokenMaxAge: '',
    pwResetTokenExpiresIn: '',
    sendgridApiKey: '',
    sendgridSignupTemplateId: '',
    sendgridPasswordResetTemplateId: '',
    bbUrl: '',

    // sendgridOrderReceivedTemplateId: '',
    // algoliaAdminApiKey: '',
    stripeSk: '',
    stripeWsk: '',

    public: {
      apiUrl: '',
      // siteUrl: '',
      doSpaceEndpoint: '',
      // maxFileUploads: '',
      fromEmail: '',
      fromName: '',
      // algoliaApplicationId: '',
      stripePk: '',
    },
  },
})
