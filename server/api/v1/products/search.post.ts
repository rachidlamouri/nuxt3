import slugify from 'slugify'
import { ObjectId } from 'mongodb'

import { MongoClient } from 'mongodb'
// import { productSchema, nextHigherAssemblySchema, defaultSchema } from '~/server/utils/dbSchemas'
import productSchema from '~~/server/modelSchemas/product'
import defaultSchema from '~~/server/modelSchemas/default'

const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const pipeline = [
    {
      $search: {
        // index: 'products',
        text: {
          query: body.searchText,
          path: [
            'name',
            'description',
            'price',
            'sku',
            'oem',
            'oemPartNumber',
            'eligibilities.name',
            'nextHigherAssemblies.name',
            'nextHigherAssemblies.partNumber',
          ],
          fuzzy: {
            maxEdits: 2,
          },
        },
        highlight: {
          path: ['oem', 'eligibilities.name'],
        },
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        acsPartNumber: 1,
        slug: 1,
        media: 1,
        price: 1,
        description: 1,
        oem: 1,
        oemPartNumber: 1,
        eligibilities: 1,
        nextHigherAssemblies: 1,
        score: { $meta: 'searchScore' },
        highlights: {
          $meta: 'searchHighlights',
        },
      },
    },
  ]
  const cursor = mongoClient.db().collection('products').aggregate(pipeline)
  const docs = await cursor.toArray()
  console.log(docs)
  return docs
})
