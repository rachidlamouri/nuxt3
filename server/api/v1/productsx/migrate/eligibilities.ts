import slugify from 'slugify'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'
const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const allEligibilities: Array<{ name: string; slug: string }> = []
    for (const product of body) {
      const productEligibilities = product.eligibility
        ? product.eligibility.split(',').map((e: string) => e.trim())
        : []
      for (const eligibility of productEligibilities) {
        const found = allEligibilities.find((e) => e.name === eligibility)
        if (!found)
          allEligibilities.push({
            name: eligibility,
            slug: slugify(eligibility, { lower: true }),
          })
      }
    }
    return await mongoClient.db().collection('eligibilities').insertMany(allEligibilities)
  } catch (err) {
    return errorHandler(event, err)
  }
})
