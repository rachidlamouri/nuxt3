import { aggregateFetch } from '~/server/controllers/v1/factory'
import { productRepository, EntityId } from '~/server/redisSchemas/product'
import { fetchAll } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import { protect } from '#auth'
import errorHandler from '~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    if (!(await protect(event))) throw new AppError('You are not authorized', 'not_authorized', 404)
    return await fetchAll(productRepository)
  } catch (err) {
    return errorHandler(event, err)
  }
})

// import { aggregateFetch } from '~/server/controllers/v1/factory'

// export default defineEventHandler(async (event) => {
//   // console.log('YYYYYYY', event.context.auth)
//   const lookup = [
//     {
//       $lookup: {
//         from: 'eligibilities',
//         localField: 'eligibilities',
//         foreignField: '_id',
//         as: 'eligibilities',
//       },
//     },

//     {
//       $lookup: {
//         from: 'nexthigherassemblies',
//         localField: 'nextHigherAssemblies',
//         foreignField: '_id',
//         as: 'nextHigherAssemblies',
//       },
//     },
//   ]

//   return aggregateFetch(event, 'products', lookup)
// })