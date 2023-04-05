import { productRepository } from '~/server/redisSchemas/product'
import slugify from 'slugify'
import { ObjectId } from 'mongodb'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'
import productSchema from '~~/server/modelSchemas/product'
import oemSchema from '~~/server/modelSchemas/oem'
import oemPartNumberSchema from '~~/server/modelSchemas/oemPartNumber'
import { IProduct } from '~/utils/types'
import { createManyProducts } from '#commerce'

const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const products = []
    for (const product of body.data) {
      const eligibilities = []
      const productEligibilities = product.eligibility
        ? product.eligibility.split(',').map((e: string) => e.trim())
        : []
      for (const eligibility of productEligibilities) {
        eligibilities.push({
          name: eligibility,
          slug: slugify(eligibility, { lower: true }),
        })
      }

      const nextHigherAssemblies = []
      const productNextHigherAssemblies = product.nextHigherAssembly
        ? product.nextHigherAssembly.split(',').map((e: string) => e.trim())
        : []
      for (const nextHigherAssembly of productNextHigherAssemblies) {
        const parts = nextHigherAssembly.split(':')
        // console.log('PPPP', parts)
        const partNumber =
          parts && Array.isArray(parts) && parts.length > 0 ? nextHigherAssembly.split(':')[0].trim() : ''
        const description =
          parts && Array.isArray(parts) && parts.length > 1 ? nextHigherAssembly.split(':')[1].trim() : ''
        nextHigherAssemblies.push({
          name: nextHigherAssembly,
          partNumber,
          description,
          slug: slugify(nextHigherAssembly, { lower: true }),
        })
      }

      products.push({
        acsPartNumber: product.title,
        name: product.title,
        slug: slugify(product.title, { lower: true }),
        media: [{ name: product.image, slug: slugify(product.image, { lower: true }) }],
        description: product.content,
        oem: product.oem,
        oemPartNumber: product.oemPartNumber,
        qtySold: +product.qtySold,
        tbq: product.tbq ? true : false,
        price: +product.price * 100,
        salePrice: +product.price * 100,
        sku: product.sku,
        stockQty: 0,
        sortOrfder: 0,
        status: 'Active',
        eligibilities,
        nextHigherAssemblies,
        dateCreated: new Date(Date.now()),
      })
    }
    // const result = await createManyProducts(event, products)
    return await mongoClient.db().collection('products').insertMany(products)
    // const xx = await productRepository.save(products[0])
    // console.log(xx)
    // return result
  } catch (err) {
    return errorHandler(event, err)
  }
})
