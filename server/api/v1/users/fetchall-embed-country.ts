import { aggregateFetch } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import { mongoClient } from '~/utils/mongoClient'

export default defineEventHandler(async (event) => {
  const query = { ...getQuery(event) }
  console.log('Query', query)

  const pipeline = []
  // MATCH
  if (query.match) {
    const matchObj = (query.match as string)
      .split(',')
      .map((p) => p.trim().split('='))
      .reduce((arrr: any, arr: any) => {
        const parts: any = arr[0].split('[')
        if (parts.length > 1) arrr.push({ [arr[0].split('[')[0]]: { [arr[0].split('[')[1].split(']')[0]]: +arr[1] } })
        else arrr.push({ [arr[0].split('[')[0]]: arr[1] })
        return arrr
      }, [])
    pipeline.push({
      $match: {
        $and: JSON.parse(JSON.stringify(matchObj).replace(/\b(eq|ne|gte|gt|lte|lt)\b/g, (match) => `$${match}`)),
      },
    })
  }

  pipeline.push({ $unwind: '$userAddresses' })

  pipeline.push({
    $lookup: {
      from: 'countries',
      localField: 'userAddresses.country',
      foreignField: '_id',
      as: 'userAddresses.country',
    },
  })

  pipeline.push({ $unwind: '$userAddresses.country' })
  pipeline.push({
    $group: {
      _id: '$_id',
      userAddresses: {
        $push: '$userAddresses',
      },
    },
  })

  pipeline.push({
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userDetails',
    },
  })

  pipeline.push({ $unwind: '$userDetails' })

  pipeline.push({
    $addFields: {
      'userDetails.userAddresses': '$userAddresses',
    },
  })
  pipeline.push({
    $replaceRoot: {
      newRoot: '$userDetails',
    },
  })

  console.log('PPPP', pipeline)
  console.log('PPPP', JSON.stringify(pipeline))

  const cursor = mongoClient.db().collection('users').aggregate(pipeline)
  const docs = await cursor.toArray()
  if (!docs) throw new AppError(`We were not able to fetch ${'users'}`, 400)
  // console.log(docs)
  return docs
  // unwind.push({ $unwind: '$userAddresses.country' })

  // lookup.push({
  //   $lookup: {
  //     from: 'provences',
  //     localField: 'userAddresses.provence',
  //     foreignField: '_id',
  //     as: 'provence',
  //   },
  // })
  // unwind.push({ $unwind: '$userAddresses.provence' })

  // if ((query.project as string).includes('phoneNumbers')) {
  //   lookup.push({
  //     $lookup: {
  //       from: 'countries',
  //       localField: 'phoneNumbers.country',
  //       foreignField: '_id',
  //       as: 'country',
  //     },
  //   })
  //   unwind.push({ $unwind: '$phoneNumbers.country' })
  // }

  // return true
  // return aggregateFetch(event, 'users', lookup, unwind)
})

// import { fetchAll } from '~/server/controllers/v1/products'

// interface ISortObj {
//   [key: string]: number
// }

// export default defineEventHandler(async (event) => {
//   const query = { ...getQuery(event) }
//   console.log('QQQ1', query)

//   const pipeline = []

//   if (query.project) {
//     const parts = (query.project as string).split(',')
//     interface XX {
//       [index: string]: number
//     }
//     const projectObj: XX = {}

//     for (const prop in parts) {
//       console.log(parts[prop])
//       projectObj[parts[prop].trim()] = 1
//     }

//     pipeline.push({
//       $project: projectObj,
//     })

//     // return projectObj
//   }

//   // Project stage
//   // pipeline.push({
//   //   $project: {
//   //     acsPartNumber: 1,
//   //     price: 1,
//   //     slug: 1,
//   //     media: 1,
//   //     oem: 1,
//   //     tbq: 1,
//   //   },
//   // })

//   // Sort stage
//   if (query.sort) {
//     const sortObj: ISortObj = {}
//     const sortArr = String(query.sort).split('-')
//     if (sortArr.length === 1) sortObj[sortArr[0]] = 1
//     else sortObj[sortArr[1]] = -1
//     pipeline.push({
//       $sort: sortObj,
//     })
//   }

//   // Skip and limit
//   const page: number = query.page && Number(query.page) * 1 >= 1 ? Number(query.page) * 1 : 1
//   const limit = query.limit && Number(query.limit) * 1 > 0 ? Number(query.limit) * 1 : 100
//   const skip = (page - 1) * limit
//   pipeline.push({ $skip: skip })
//   pipeline.push({ $limit: limit })

//   // console.log('PPPP', pipeline)

//   return await fetchAll(event, pipeline, 'users')
// })
