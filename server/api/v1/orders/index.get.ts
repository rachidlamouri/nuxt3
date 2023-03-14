import { aggregateFetch } from '~/server/controllers/v1/factory'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import AppError from '~/utils/AppError'
import { findById } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  const query = { ...getQuery(event) }
  if (!query.cartId) return {}

  const order = await findById('orders', query.cartId as string)
  if (!order) return {}
  return order
})
