import slugify from 'slugify'
import { ObjectId } from 'mongodb'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'

import { IProduct } from '~/utils/types'

const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)

export default defineEventHandler(async (event) => {
  const reqMethod = getMethod(event)

  try {
    const body = await readBody(event)
    const eligibilities = body.eligibility ? body.eligibility.split(',').map((e: string) => e.trim()) : []
    const nextHigherAssemblies = body.nextHigherAssembly
      ? body.nextHigherAssembly.split(',').map((e: string) => e.trim())
      : []
    // console.log(body)
    // return true
    const product: IProduct = {
      name: body.title,
      acsPartNumber: body.title,
      slug: slugify(body.title, { lower: true }),
      media: [{ name: body.image, slug: slugify(body.image, { lower: true }) }],
      description: body.content,
      oem: body.oem,
      oemPartNumber: body.oemPartNumber,
      qtySold: body.qtySold * 1,
      tbq: body.tbq ? true : false,
      // stockQty: 0,
      price: body.price * 1,
      salePrice: body.price * 1,
      sku: body.sku,
      eligibilities: [],
      nextHigherAssemblies: [],
      // status: 'Published',
    }
    // let found: any
    // let createdAttribute: any
    // let newObjectId: any

    for (const prop in eligibilities) {
      product.eligibilities.push({
        name: eligibilities[prop],
        slug: slugify(eligibilities[prop], { lower: true }),
      })
    }

    for (const prop in nextHigherAssemblies) {
      const parts = nextHigherAssemblies[prop] ? nextHigherAssemblies[prop].split(':').map((p: string) => p.trim()) : []
      product.nextHigherAssemblies.push({
        partNumber: parts.length && parts.length > 0 ? parts[0] : '',
        name: parts.length && parts.length > 1 ? parts[1] : '',
        slug: parts.length && parts.length > 1 ? slugify(parts[1], { lower: true }) : '',
      })
    }

    const newProduct = await mongoClient.db().collection('products').insertOne(product)
    return await mongoClient
      .db()
      .collection('products')
      .findOne({ _id: new ObjectId(newProduct.insertedId) })
  } catch (err) {
    errorHandler(event, err)
  }
})
