import { fetchProducts } from '#commerce'
import { productRepository, EntityId } from '~/server/redisSchemas/product'
// import { fetchAllProducts } from '#commerce'
import AppError from '~/utils/AppError'
import { protect } from '#auth'
import errorHandler from '~/utils/errorHandler'
// import { aggregateFetch } from '~/server/controllers/v1/factory'

// export default defineEventHandler(async (event) => {
//   // try {
//   //   return await fetchAllProducts(event)
//   // } catch (err) {
//   //   return errorHandler(event, err)
//   // }
// })

export default defineEventHandler(async (event) => {
  // console.log('YYYYYYY', event.context.auth)
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

  return await fetchProducts(event, 'products')
})
