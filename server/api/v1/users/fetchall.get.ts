import { aggregateFetch } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  const query = { ...getQuery(event) }
  console.log('Query', query)

  return aggregateFetch(event, 'users', [], [])
})
