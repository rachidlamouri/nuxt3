import slugify from 'slugify'
import { ObjectId } from 'mongodb'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // const oem = await mongoClient.db().collection('oems').findOne({ name: body.oem.trim() })
    const oemPartNumber = await mongoClient
      .db()
      .collection('oempartnumbers')
      .findOne({ partNumber: body.oemPartNumber.trim() })
    const eligibilities = []
    const productEligibilities = body.eligibility ? body.eligibility.split(',').map((e: string) => e.trim()) : []
    for (const eligibility of productEligibilities) {
      const found = await mongoClient.db().collection('eligibilities').findOne({ name: eligibility.trim() })
      if (found) eligibilities.push(found._id)
    }
    const nextHigherAssemblies = []
    const productNextHigherAssemblies = body.nextHigherAssembly
      ? body.nextHigherAssembly.split(',').map((e: string) => e.trim())
      : []
    for (const nextHigherAssembly of productNextHigherAssemblies) {
      const found = await mongoClient
        .db()
        .collection('nexthigherassemblies')
        .findOne({ name: nextHigherAssembly.trim() })
      if (found) nextHigherAssemblies.push(found._id)
    }

    return await mongoClient
      .db()
      .collection('products')
      .insertOne({
        acsPartNumber: body.title,
        slug: slugify(body.title, { lower: true }),
        media: [{ name: body.image, slug: slugify(body.image, { lower: true }) }],
        description: body.content,
        oem: body.oem,
        oemPartNumber: body.oemPartNumber,
        qtySold: +body.qtySold,
        tbq: body.tbq ? true : false,
        price: Math.round(body.price * 100),
        salePrice: Math.round(body.price * 100),
        sku: body.sku,
        status: 'Active',
        eligibilities,
        nextHigherAssemblies,
      })
  } catch (err) {
    return errorHandler(event, err)
  }
})
