import { aggregateFetch } from '~/server/controllers/v1/factory'
import { userRepository, EntityId } from '~/server/redisSchemas/user'
import { fetchAll } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import { protect } from '#auth'
import errorHandler from '~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    console.log('KKKKKKK', await protect(event))
    if (!(await protect(event))) throw new AppError('You are not authorized', 'not_authorized', 404)
    // const query = { ...getQuery(event) }
    console.log('LLLLLLLL')
    return await fetchAll(userRepository)
  } catch (err) {
    return errorHandler(event, err)
  }
})
