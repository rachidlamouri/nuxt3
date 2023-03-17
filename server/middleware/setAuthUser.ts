import errorHandler from '~~/utils/errorHandler'
import { findByEmail, checkPassword, getSinedJwtToken, setAuthCookie } from '~/server/controllers/v1/auth'

import { getServerSession, getToken } from '#auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event)
    const token = await getToken({ event })
    if (
      event.node.req.headers &&
      event.node.req.headers.authorization &&
      event.node.req.headers.authorization === 'jwtsession'
    ) {
      console.log('SESSION', session)
      console.log('Token', token)
      const authToken = token && token.email ? token.email : ''
      const user = await findByEmail(authToken)
      if (user) event.context.auth = user
    }
  } catch (err) {
    return errorHandler(event, err)
  }
})
