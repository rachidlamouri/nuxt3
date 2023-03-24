import slugify from 'slugify'
import { ObjectId } from 'mongodb'
import { MongoClient } from 'mongodb'
import errorHandler from '~/utils/errorHandler'
import productSchema from '~~/server/modelSchemas/product'
import oemSchema from '~~/server/modelSchemas/oem'
import oemPartNumberSchema from '~~/server/modelSchemas/oemPartNumber'
import { IProduct } from '~/utils/types'

const config = useRuntimeConfig()
const mongoClient = new MongoClient(config.dbUrl)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    const collections = await mongoClient.db().listCollections().toArray()
    switch (query.db) {
      case 'oems':
        // Create OEM table
        const oemCollection = collections.find((c) => c.name === 'oems')
        if (oemCollection) await mongoClient.db().collection('oems').drop()
        await mongoClient.db().createCollection('oems', oemSchema)
        await mongoClient.db().collection('oems').createIndex({ name: 1 }, { unique: true })
        const oems: Array<{ name: string; slug: string }> = []
        for (const product of body) {
          const oem = oems.find((o) => o.name === product.oem.trim())
          if (!oem) oems.push({ name: product.oem.trim(), slug: slugify(product.oem.trim(), { lower: true }) })
        }
        return await mongoClient.db().collection('oems').insertMany(oems)
        break

      case 'oemPartNumbers':
        const oemPartNumberCollection = collections.find((c) => c.name === 'oempartnumbers')
        if (oemPartNumberCollection) await mongoClient.db().collection('oempartnumbers').drop()
        await mongoClient.db().createCollection('oempartnumbers', oemPartNumberSchema)
        await mongoClient.db().collection('oempartnumbers').createIndex({ partNumber: 1 }, { unique: true })
        const oemPartNumbers: Array<{ partNumber: string; slug: string; oem?: ObjectId }> = []
        for (const product of body) {
          const oemPartNumber = oemPartNumbers.find((o) => o.partNumber === product.oemPartNumber.trim())
          if (!oemPartNumber) {
            const oem = await mongoClient.db().collection('oems').findOne({ name: product.oem.trim() })
            if (oem)
              oemPartNumbers.push({
                partNumber: product.oemPartNumber.trim(),
                slug: slugify(product.oemPartNumber.trim(), { lower: true }),
                oem: new ObjectId(oem._id),
              })
            else
              oemPartNumbers.push({
                partNumber: product.oemPartNumber.trim(),
                slug: slugify(product.oemPartNumber.trim(), { lower: true }),
              })
          }
        }
        return await mongoClient.db().collection('oempartnumbers').insertMany(oemPartNumbers)
        break

      case 'eligibilities':
        const eligibilityCollection = collections.find((c) => c.name === 'eligibilities')
        if (eligibilityCollection) await mongoClient.db().collection('eligibilities').drop()
        await mongoClient.db().createCollection('eligibilities', oemSchema)
        await mongoClient.db().collection('eligibilities').createIndex({ name: 1 }, { unique: true })
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
        break

      case 'nextHigherAssemblies':
        const nextHigherAssemblyCollection = collections.find((c) => c.name === 'nextHigherAssemblies')
        if (nextHigherAssemblyCollection) await mongoClient.db().collection('nextHigherAssemblies').drop()
        await mongoClient.db().createCollection('nextHigherAssemblies', oemSchema)
        await mongoClient.db().collection('nextHigherAssemblies').createIndex({ name: 1 }, { unique: true })
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
        break

      case 'products':
        const productCollection = collections.find((c) => c.name === 'products')
        if (productCollection) await mongoClient.db().collection('products').drop()
        await mongoClient.db().createCollection('products', productSchema)
        await mongoClient.db().collection('products').createIndex({ acsPartNumber: 1 }, { unique: true })
        const products: Array<IProduct> = []

        for (const product of body) {
          const oem = await mongoClient.db().collection('oems').findOne({ name: product.oem.trim() })
          const oemPartNumber = await mongoClient
            .db()
            .collection('oempartnumbers')
            .findOne({ partNumber: product.oemPartNumber.trim() })
          const eligibilities = []
          const productEligibilities = product.eligibility
            ? product.eligibility.split(',').map((e: string) => e.trim())
            : []
          for (const eligibility of productEligibilities) {
            const found = await mongoClient.db().collection('eligibilities').findOne({ name: eligibility.trim() })
            if (found) eligibilities.push(found._id)
          }
          const nextHigherAssemblies = []
          const productNextHigherAssemblies = product.nextHigherAssembly
            ? product.nextHigherAssembly.split(',').map((e: string) => e.trim())
            : []
          for (const nextHigherAssembly of productNextHigherAssemblies) {
            const found = await mongoClient
              .db()
              .collection('nexthigherassemblies')
              .findOne({ name: nextHigherAssembly.trim() })
            if (found) nextHigherAssemblies.push(found._id)
          }

          products.push({
            acsPartNumber: product.title,
            slug: slugify(product.title, { lower: true }),
            media: [{ name: product.image, slug: slugify(product.image, { lower: true }) }],
            description: product.content,
            oem: new ObjectId(oem!._id),
            oemPartNumber: new ObjectId(oemPartNumber!._id),
            qtySold: +product.qtySold,
            tbq: product.tbq ? true : false,
            price: +product.price * 100,
            salePrice: +product.price * 100,
            sku: product.sku,
            status: 'Active',
            eligibilities,
            nextHigherAssemblies,
          })
        }
        return await mongoClient.db().collection('products').insertMany(products)
        break

      default:
        break
    }
  } catch (err) {
    return errorHandler(event, err)
  }
})
