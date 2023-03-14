import { aggregateFetch } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
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
