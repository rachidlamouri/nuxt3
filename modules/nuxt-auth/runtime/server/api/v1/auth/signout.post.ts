import { H3Event } from 'h3'
import { redis } from '~/utils/redisClient'
import { userRepository, EntityId } from '~~/server/redisSchemas/user'

import { findByEmail, checkPassword, getSinedJwtToken, setAuthCookie } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { authenticatedDataSchema } from '~/utils/schema'
// import { setUserSession } from '#session'
import { fetchAuthUser, setUserSession, removeUserSession } from '#auth'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    if (!removeUserSession(event)) return false
    const user = event.context.user
    if (!user) return false
    // console.log('>>>>>>>>>', true)
    return true
  } catch (err) {
    return errorHandler(event, err)
  }
})
