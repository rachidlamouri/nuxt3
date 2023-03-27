import { mongoClient } from '../../utils/mongoClient'
// import colors from 'colors'
import userSchema from '../../server/modelSchemas/user'
import orderSchema from '../../server/modelSchemas/order'
import productSchema from '../../server/modelSchemas/product'
import provenceSchema from '../../server/modelSchemas/provence'
import countrySchema from '../../server/modelSchemas/country'
import { createClient } from 'redis'
import { Schema, Repository, EntityId } from 'redis-om'

export default async (inlineOptions: any, nuxt: any) => {
  nuxt.hook('listen', async (nuxt: any) => {
    try {
      /////////redis

      const redis = createClient({
        url: process.env.NUXT_REDIS_URL as string,
      })
      redis.on('error', (err) => console.log('Redis Client Error', err))
      await redis.connect()
      console.log(`redis connection succesfull`)

      const productSchema = new Schema('product', {
        name: { type: 'string' },
        price: { type: 'number' },
      })

      const productRepository = new Repository(productSchema, redis)
      let product = {
        name: 'The Righteous & The Butterfly',
        price: 2014,
      }

      product = await productRepository.save(product)
      console.log(product[EntityId])
      console.log(await productRepository.fetch(product[EntityId]))

      ////////////

      // Connect to database
      await mongoClient.connect()
      console.log(`Database connection succesfull`)

      // Fetch all collections
      const collections = await mongoClient.db().listCollections().toArray()

      // create products collection
      if (!collections.find((c) => c.name === 'products')) {
        await mongoClient.db().createCollection('products', productSchema)
        await mongoClient.db().collection('products').createIndex({ name: 1 }, { unique: true })
        console.log(`Product database creation succesfull`)
      }

      // Create users collection if it does not exist
      if (!collections.find((c) => c.name === 'orders')) {
        await mongoClient.db().createCollection('orders', orderSchema)
        console.log(`Orders database creation succesfull`)
      }

      // Create users collection if it does not exist
      if (!collections.find((c) => c.name === 'users')) {
        await mongoClient.db().createCollection('users', userSchema)
        await mongoClient.db().collection('users').createIndex({ email: 1 }, { unique: true })
        console.log(`Users database creation succesfull`)
      }

      // create states collection
      if (!collections.find((c) => c.name === 'provences')) {
        await mongoClient.db().createCollection('provences', provenceSchema)
        await mongoClient.db().collection('provences').createIndex({ name: 1 }, { unique: true })
        // await mongoClient
        //   .db()
        //   .collection('provences')
        //   .createIndex({ name: 'text', abbreviation: 'text' }, { weights: { name: 2, abbreviation: 1 } })
        console.log(`Provences database creation succesfull`)
      }

      // create countries collection
      if (!collections.find((c) => c.name === 'countries')) {
        await mongoClient.db().createCollection('countries', countrySchema)
        await mongoClient.db().collection('countries').createIndex({ countryName: 1 }, { unique: true })
        // await mongoClient
        //   .db()
        //   .collection('countries')
        //   .createIndex(
        //     { countryName: 'text', threeLetterCountryCode: 'text' },
        //     { weights: { countryName: 2, threeLetterCountryCode: 1 } }
        //   )
        console.log(`Countries database creation succesfull`)
      }
    } catch (err) {
      console.log(`Mongo DB connection or databases creation Error ${err}`)
    }
  })
}
