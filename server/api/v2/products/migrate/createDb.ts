import { MongoClient } from 'mongodb'
import oemSchema from '~~/server/modelSchemas/oem'
import oemPartNumberSchema from '~~/server/modelSchemas/oemPartNumber'
import elegibilitySchema from '~~/server/modelSchemas/oem'
import nextHigherAssemblySchema from '~~/server/modelSchemas/oem'
import productSchema from '~~/server/modelSchemas/product'
import errorHandler from '~/utils/errorHandler'

const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)

export default defineEventHandler(async (event) => {
  try {
    const collections = await mongoClient.db().listCollections().toArray()

    // const oemCollection = collections.find((c) => c.name === 'oems')
    // if (oemCollection) await mongoClient.db().collection('oems').drop()
    // await mongoClient.db().createCollection('oems', oemSchema)
    // await mongoClient.db().collection('oems').createIndex({ name: 1 }, { unique: true })

    const oemPartNumberCollection = collections.find((c) => c.name === 'oempartnumbers')
    if (oemPartNumberCollection) await mongoClient.db().collection('oempartnumbers').drop()
    await mongoClient.db().createCollection('oempartnumbers', oemPartNumberSchema)
    await mongoClient.db().collection('oempartnumbers').createIndex({ partNumber: 1 }, { unique: true })

    const eligibilityCollection = collections.find((c) => c.name === 'eligibilities')
    if (eligibilityCollection) await mongoClient.db().collection('eligibilities').drop()
    await mongoClient.db().createCollection('eligibilities', elegibilitySchema)
    await mongoClient.db().collection('eligibilities').createIndex({ name: 1 }, { unique: true })

    const nextHigherAssemblyCollection = collections.find((c) => c.name === 'nextHigherAssemblies')
    if (nextHigherAssemblyCollection) await mongoClient.db().collection('nextHigherAssemblies').drop()
    await mongoClient.db().createCollection('nextHigherAssemblies', nextHigherAssemblySchema)
    await mongoClient.db().collection('nextHigherAssemblies').createIndex({ name: 1 }, { unique: true })

    const productCollection = collections.find((c) => c.name === 'products')
    if (productCollection) await mongoClient.db().collection('products').drop()
    await mongoClient.db().createCollection('products', productSchema)
    await mongoClient.db().collection('products').createIndex({ acsPartNumber: 1 }, { unique: true })

    return true
  } catch (err) {
    errorHandler(event, err)
  }
})
