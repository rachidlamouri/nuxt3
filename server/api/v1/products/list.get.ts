import { aggregateFetch } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  // console.log('YYYYYYY', event.context.auth)
  const lookup = [
    {
      $lookup: {
        from: 'eligibilities',
        localField: 'eligibilities',
        foreignField: '_id',
        as: 'eligibilities',
      },
    },

    {
      $lookup: {
        from: 'nexthigherassemblies',
        localField: 'nextHigherAssemblies',
        foreignField: '_id',
        as: 'nextHigherAssemblies',
      },
    },
  ]

  return aggregateFetch(event, 'products', lookup)
})
