import { aggregateFetch, findBySlug } from '~/server/controllers/v1/factory'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

export default defineEventHandler(async (event) => {
  // console.log(event.context.params)
  // const slug = event.context && event.context.params && event.context.params.slug ? event.context.params.slug : ''
  // const product = await findBySlug('products', slug)
  // if (!product) return []
  // console.log(product)
  // const cursor = mongoClient
  //   .db()
  //   .collection('products')
  //   .find({
  //     nextHigherAssemblies: { $all: product.nextHigherAssemblies },
  //   })
  // if (cursor) return await cursor.toArray()
  // return []
  // return true
  // const lookup = [
  //   {
  //     $lookup: {
  //       from: 'eligibilities',
  //       localField: 'eligibilities',
  //       foreignField: '_id',
  //       as: 'eligibilities',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'nexthigherassemblies',
  //       localField: 'nextHigherAssemblies',
  //       foreignField: '_id',
  //       as: 'nextHigherAssemblies',
  //     },
  //   },
  // ]
  // return aggregateFetch(event, 'products', lookup)
})
