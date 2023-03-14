import slugify from 'slugify'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

// import { ObjectId } from 'mongodb'
// import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'
const config = useRuntimeConfig()
// const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const oemPartNumbers: Array<{ partNumber: string; slug: string; oem: string }> = []

    for (const product of body) {
      const oemPartNumber = oemPartNumbers.find((o) => o.partNumber === product.oemPartNumber.trim())
      if (!oemPartNumber) {
        // const oem = await mongoClient.db().collection('oems').findOne({ name: product.oem.trim() })
        // if (oem)
        oemPartNumbers.push({
          partNumber: product.oemPartNumber.trim(),
          slug: slugify(product.oemPartNumber.trim(), { lower: true }),
          oem: product.oem,
        })
        // else
        //   oemPartNumbers.push({
        //     partNumber: product.oemPartNumber.trim(),
        //     slug: slugify(product.oemPartNumber.trim(), { lower: true }),
        //   })
      }
    }
    return await mongoClient.db().collection('oempartnumbers').insertMany(oemPartNumbers)
  } catch (err) {
    return errorHandler(event, err)
  }
})
