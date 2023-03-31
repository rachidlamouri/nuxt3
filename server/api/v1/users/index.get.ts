import { aggregateFetch } from '~/server/controllers/v1/factory'
import { userRepository, EntityId } from '~/server/redisSchemas/user'
import { fetchAll } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  // console.log('KKKKKKKK')
  const query = { ...getQuery(event) }
  // console.log('Query', query)
  return await fetchAll(userRepository)

  // return aggregateFetch(event, 'users', [], [])
})
