import slugify from 'slugify'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const oems: Array<{ name: string; slug: string }> = []
    for (const product of body) {
      const oem = oems.find((o) => o.name === product.oem.trim())
      if (!oem) oems.push({ name: product.oem.trim(), slug: slugify(product.oem.trim(), { lower: true }) })
    }
    return await mongoClient.db().collection('oems').insertMany(oems)
  } catch (err) {
    return errorHandler(event, err)
  }
})
