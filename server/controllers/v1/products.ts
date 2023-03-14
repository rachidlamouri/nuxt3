// import { MongoClient } from 'mongodb'
import { H3Event } from 'h3'
import { mongoClient } from '~~/utils/mongoClient'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { IProduct } from '~/utils/types'

// const config = useRuntimeConfig()

// const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)

const fetchAll = async (event: H3Event, pipeline: Array<object>, collection: string) => {
  try {
    const countd = await mongoClient.db().collection(collection).countDocuments()
    // return countd
    // console.log('AYTH', event.context.auth)
    const cursor = mongoClient.db().collection(collection).aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs) throw new AppError(`We were not able to fetch ${collection}`, 400)
    // console.log(docs)
    return docs
  } catch (err) {
    return errorHandler(event, err)
  }
}

const fetchCount = async (event: H3Event, collection: string) => {
  try {
    return await mongoClient.db().collection(collection).countDocuments()
    // // return countd
    // // console.log('AYTH', event.context.auth)
    // const cursor = mongoClient.db().collection(collection).aggregate(pipeline)
    // const docs = await cursor.toArray()
    // if (!docs) throw new AppError(`We were not able to fetch ${collection}`, 400)
    // return { countd, docs }
  } catch (err) {
    return errorHandler(event, err)
  }
}

export { fetchAll, fetchCount }
