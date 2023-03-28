import AppError from '~/utils/AppError'
import redis from '~/utils/redisClient'
import { userRepository, EntityId } from '~/server/redisSchemas/User'
import errorHandler from '~/utils/errorHandler'

import { findByEmail } from '~/server/controllers/v1/auth'
export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    await redis.connect()
    const found = await userRepository.search().where('email').eq(email).return.all()
    console.log('E', found)

    // console.log(await foundRepository.fetch(found[EntityId]))
    // return found[0].EntityId
    // const user = await findByEmail(body.email as string)
    if (found && Array.isArray(found) && found.length) return { userId: found[0][EntityId] }
    return { userId: null }
  } catch (err) {
    return errorHandler(event, err)
  } finally {
    await redis.disconnect()
  }
})
