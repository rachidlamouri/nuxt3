import { fetchCount } from '~/server/controllers/v1/products'

// interface ISortObj {
//   [key: string]: number
// }

export default defineEventHandler(async (event) => {
  return await fetchCount(event, 'products')
})
