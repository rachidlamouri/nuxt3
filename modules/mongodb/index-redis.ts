// import { mongoClient } from '../../utils/mongoClient'
// import  redis  from '../../utils/redisClient'
// import { createClient } from 'redis'

// import colors from 'colors'
import userSchema from '../../server/modelSchemas/user'
import orderSchema from '../../server/modelSchemas/order'
import productSchema from '../../server/modelSchemas/product'
import provenceSchema from '../../server/modelSchemas/provence'
import countrySchema from '../../server/modelSchemas/country'
// import { redis } from '../../utils/redisClient'
import { SchemaFieldTypes } from 'redis'

import { productRepository } from '../../server/redisSchemas/product'
import { userRepository } from '../../server/redisSchemas/user'
import appRedis from '../../utils/AppRedis'

export default async (inlineOptions: any, nuxt: any) => {
  nuxt.hook('listen', async (nuxt: any) => {
    try {
      // const createUserIndex = async () => {

      // redis.on('error', (err) => console.log('Redis Client Error', err))

      // const appRedis = new appRedis(process.env.NUXT_REDIS_URL as string)

      await appRedis.connect()
      const dbIndexes = ['idx:Products', 'idx:User']
      const currentIndexes = await appRedis.client.ft._list()
      console.log('LIST', await appRedis.client.ft._list())

      if (!currentIndexes.includes('idx:User')) {
        await appRedis.client.ft.create(
          'idx:User',
          {
            '$.id': {
              type: SchemaFieldTypes.TEXT,
              AS: 'id',
              SORTABLE: true,
            },
            '$.name': {
              type: SchemaFieldTypes.TEXT,
              AS: 'name',
              SORTABLE: true,
            },
            '$.accountNumber': {
              type: SchemaFieldTypes.NUMERIC,
              AS: 'accountNumber',
              SORTABLE: true,
            },
            '$.email': {
              type: SchemaFieldTypes.TAG,
              AS: 'email',
            },
            '$.role': {
              type: SchemaFieldTypes.TEXT,
              AS: 'role',
            },
            '$.active': {
              type: SchemaFieldTypes.TAG,
              AS: 'active',
            },
            '$.verified': {
              type: SchemaFieldTypes.TAG,
              AS: 'verified',
            },
          },
          {
            ON: 'JSON',
            PREFIX: 'User:',
          }
        )
        console.log('idx:User index created')
      } else {
        console.log('idx:User index alreday exists')
      }

      if (!currentIndexes.includes('idx:Product')) {
        await appRedis.client.ft.create(
          'idx:Product',
          {
            '$.id': {
              type: SchemaFieldTypes.TEXT,
              AS: 'id',
              SORTABLE: true,
            },
            '$.acsPartNumber': {
              type: SchemaFieldTypes.TEXT,
              AS: 'acsPartNumber',
              SORTABLE: true,
            },
            '$.description': {
              type: SchemaFieldTypes.TEXT,
              AS: 'description',
              SORTABLE: true,
            },
            '$.oem': {
              type: SchemaFieldTypes.TEXT,
              AS: 'oem',
              SORTABLE: true,
            },
            '$.oemPartNumber': {
              type: SchemaFieldTypes.TEXT,
              AS: 'oemPartNumber',
              SORTABLE: true,
            },
            '$.price': {
              type: SchemaFieldTypes.NUMERIC,
              AS: 'price',
              SORTABLE: true,
            },
            '$.salePrice': {
              type: SchemaFieldTypes.NUMERIC,
              AS: 'salePrice',
              SORTABLE: true,
            },
            '$.qtySold': {
              type: SchemaFieldTypes.NUMERIC,
              AS: 'qtySold',
              SORTABLE: true,
            },
            '$.tbq': {
              type: SchemaFieldTypes.TAG,
              AS: 'tbq',
            },
            '$.sku': {
              type: SchemaFieldTypes.TEXT,
              AS: 'sku',
            },
            '$.status': {
              type: SchemaFieldTypes.TEXT,
              AS: 'status',
            },
            '$.eligibilities.name': {
              type: SchemaFieldTypes.TEXT,
              AS: 'eligibilities',
            },
            '$.nextHigherAssemblies.name': {
              type: SchemaFieldTypes.TEXT,
              AS: 'nextHigherAssemblies',
            },
          },
          {
            ON: 'JSON',
            PREFIX: 'Product:',
          }
        )
        console.log('idx:Product index created')
      } else {
        console.log('idx:Product index alreday exists')
      }

      // await appRedis.client.disconnect()
      console.log('ALL GOOD')
      // }

      // createUserIndex()
      // const redis = createClient({
      //   url: process.env.NUXT_REDIS_URL as string,
      // })
      // await redis.connect()
      // console.log(`redis appRedis succesfull`)
      // const redis = createClient({
      //   url: process.env.NUXT_REDIS_URL as string,
      // })
      // await redis.connect()
      // console.log(`redis appRedis succesfull`)
      // Connect to database
      // await mongoClient.connect()
      // console.log(`Database appRedis succesfull`)
      // // Fetch all collections
      // const collections = await mongoClient.db().listCollections().toArray()
      // // create products collection
      // if (!collections.find((c) => c.name === 'products')) {
      //   await mongoClient.db().createCollection('products', productSchema)
      //   await mongoClient.db().collection('products').createIndex({ name: 1 }, { unique: true })
      //   console.log(`Product database creation succesfull`)
      // }
      // // Create users collection if it does not exist
      // if (!collections.find((c) => c.name === 'orders')) {
      //   await mongoClient.db().createCollection('orders', orderSchema)
      //   console.log(`Orders database creation succesfull`)
      // }
      // // Create users collection if it does not exist
      // if (!collections.find((c) => c.name === 'users')) {
      //   await mongoClient.db().createCollection('users', userSchema)
      //   await mongoClient.db().collection('users').createIndex({ email: 1 }, { unique: true })
      //   console.log(`Users database creation succesfull`)
      // }
      // // create states collection
      // if (!collections.find((c) => c.name === 'provences')) {
      //   await mongoClient.db().createCollection('provences', provenceSchema)
      //   await mongoClient.db().collection('provences').createIndex({ name: 1 }, { unique: true })
      //   // await mongoClient
      //   //   .db()
      //   //   .collection('provences')
      //   //   .createIndex({ name: 'text', abbreviation: 'text' }, { weights: { name: 2, abbreviation: 1 } })
      //   console.log(`Provences database creation succesfull`)
      // }
      // // create countries collection
      // if (!collections.find((c) => c.name === 'countries')) {
      //   await mongoClient.db().createCollection('countries', countrySchema)
      //   await mongoClient.db().collection('countries').createIndex({ countryName: 1 }, { unique: true })
      //   // await mongoClient
      //   //   .db()
      //   //   .collection('countries')
      //   //   .createIndex(
      //   //     { countryName: 'text', threeLetterCountryCode: 'text' },
      //   //     { weights: { countryName: 2, threeLetterCountryCode: 1 } }
      //   //   )
      //   console.log(`Countries database creation succesfull`)
      // }
    } catch (err) {
      console.log(`Redis appRedis or index creation failed ${err}`)
    }
  })
}
