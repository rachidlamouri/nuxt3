import { MongoClient } from 'mongodb'
import productSchema from '~~/server/modelSchemas/product'
import errorHandler from '~~/utils/errorHandler'

const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)

export default defineEventHandler(async (event) => {
  try {
    const collections = await mongoClient.db().listCollections().toArray()
    const productCollection = collections.find((c) => c.name === 'products')
    if (productCollection) await mongoClient.db().collection('products').drop()
    await mongoClient.db().createCollection('products', productSchema)
    await mongoClient.db().collection('products').createIndex({ name: 1 }, { unique: true })

    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
