// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  app: {
    head: {
      // charset: 'utf-16',
      // viewport: 'width=device-width, initial-scale=1',
      title: 'ACS - A Leading Supplier of PMA Parts',
      meta: [
        {
          name: 'description',
          content:
            'ACS seeks not only to provide the best pricing in the industry, but to create value by stocking 100% of our inventory for next day delivery, offering eCommerce solutions for online customers, utilizing the latest data management technology, and offering the latest manufacturing / design solutions <a href="https://acs-parts.com">Browse ACS Catalog</a>.',
        },
        // {
        //   name: 'robots',
        //   content: 'index, follow',
        // },
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },

        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather+Sans:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700;900&display=swap',
        },

        // // Montserrat sans serif from Adobe
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/nwr4chk.css',
        },

        // Proxima Nova sans serif from Adobe
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/yge8xsm.css',
        },

        // Proxima Nova sans serif from Adobe
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/dto7hnb.css',
        },
      ],

      script: [{ src: 'https://js.stripe.com/v3/' }],

      // Inter, Merriweather serif & Merriweather Sans serif from Google
      // @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather+Sans:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700;900&display=swap');

      // // Montserrat sans serif from Adobe
      // @import url('https://use.typekit.net/nwr4chk.css');

      // {
      //   name: 'canonical',
      //   content:'href="http://example.com/"'
      // },
    },
  },
  css: ['@/assets/scss/main.scss'],
  modules: [
    '@nuxt/content',
    'nuxt-icon',
    '@sidebase/nuxt-auth',
    ['./modules/mongodb', {}],
    ['./modules/mailer/module', {}],
  ],
  auth: {},
  mailer: {
    emailSentMessage: 'Your message was sent successfully',
    contactFormEmailSubject: 'New message from yrl-consulting.com site',
    registrationEmailSubject: 'Please confirm your email address',
    forgotPasswordEmailSubject: 'Your password reset token (valid for 1 hour)',
  },
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

    authSecret: '',

    // sendgridOrderReceivedTemplateId: '',
    // algoliaAdminApiKey: '',
    stripeSk: '',
    stripeWsk: '',

    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    // smtpSecure: '',
    fromEmail: '',
    fromName: '',
    contactFormEmailRecipients: '',

    public: {
      apiUrl: '',
      // siteUrl: '',
      doSpaceEndpoint: '',
      // maxFileUploads: '',

      // algoliaApplicationId: '',
      stripePk: '',
    },
  },
})
