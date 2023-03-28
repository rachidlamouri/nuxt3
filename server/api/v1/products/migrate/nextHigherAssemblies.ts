import slugify from 'slugify'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'
const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const allNextHigherAssemblies: Array<{ name: string; slug: string }> = []
    for (const product of body) {
      const productNextHigherAssemblies = product.nextHigherAssembly
        ? product.nextHigherAssembly.split(',').map((e: string) => e.trim())
        : []
      for (const nextHigherAssembly of productNextHigherAssemblies) {
        const found = allNextHigherAssemblies.find((e) => e.name === nextHigherAssembly)
        if (!found)
          allNextHigherAssemblies.push({
            name: nextHigherAssembly,
            slug: slugify(nextHigherAssembly, { lower: true }),
          })
      }
    }
    return await mongoClient.db().collection('nexthigherassemblies').insertMany(allNextHigherAssemblies)
  } catch (err) {
    return errorHandler(event, err)
  }
})
