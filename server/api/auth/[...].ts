// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

import { findByEmail, checkPassword, getSinedJwtToken, setAuthCookie } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'

const config = useRuntimeConfig()

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: config.authSecret,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: '/auth/signin',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' },
      },
      async authorize(credentials: any) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        // const { email, password } = await readBody(event)
        if (!credentials.username || !credentials.password) return null
        // throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
        const user = await findByEmail(credentials.username)
        if (!user || !(await checkPassword(credentials.password, user.password)) || !user.verified) return null
        // throw new AppError('Invalid login credentials', 'invalid-credentials', 401)

        // throw new AppError('Invalid email or password', 'invalid_password', 401)

        return user
        // throw new AppError('You have not verified your email', 'email_not_verified', 401)
        // const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
        // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
        // setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
        // return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })

        // console.log('HHHHHHH', credentials.username, credentials.password)

        // const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

        // if (credentials?.username === user.username && credentials?.password === user.password) {
        // Any object returned will be saved in `user` property of the JWT
        // return user
        // } else {
        // eslint-disable-next-line no-console
        // console.error('Warning: Malicious login attempt registered, bad credentials provided')

        // If you return null then an error will be displayed advising the user to check their details.
        // return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      },
    }),
  ],
})
