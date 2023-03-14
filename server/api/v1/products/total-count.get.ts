import { MongoClient } from 'mongodb'
import errorHandler from '~~/utils/errorHandler'

const mongoClient = new MongoClient(String(process.env.NUXT_DB_URL))

export default defineEventHandler(async (event) => {
  // console.log(event.node.req)

  try {
    return await mongoClient.db().collection('products').countDocuments()
  } catch (err) {
    return errorHandler(event, err)
  }
})
