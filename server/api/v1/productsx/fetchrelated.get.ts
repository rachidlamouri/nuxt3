import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { aggregateFetch, findBySlug } from '~/server/controllers/v1/factory'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { fetchAll } from '~/server/controllers/v1/products'

export default defineEventHandler(async (event) => {
  // const slug = event.context.params.slug
  try {
    const query = getQuery(event)

    console.log('QQQQQQW', query)
    const slug = query.slug

    const product = await findBySlug('products', slug as string)
    if (!product) return []
    console.log(product)

    const cursor = mongoClient
      .db()
      .collection('products')
      .find({
        nextHigherAssemblies: { $all: product.nextHigherAssemblies },
      })
    const docs = await cursor.toArray()
    const index = docs.findIndex((p) => p.slug !== product.slug)
    if (index !== -1) return docs.splice(index, 1)
    return []

    // console.log('OOOOO', query)
    // let pipeline = []
    // pipeline.push({ $match: { slug: query.slug } })

    // const docs: any = await fetchAll(event, pipeline, 'products')
    // // console.log('DDDDD', docs)
    // // return docs[0]

    // try {
    //   // if (!docs || docs.length > 1)
    //   //   throw new AppError(`Either no products were found or more than one product was found`, 400)
    //   const nextHigherAssembliesPartNumbers = []
    //   for (const prop in docs[0].nextHigherAssemblies) {
    //     const nextHighAssembly = docs[0].nextHigherAssemblies[prop]
    //     nextHigherAssembliesPartNumbers.push(nextHighAssembly.partNumber)
    //   }
    //   pipeline = [
    //     {
    //       $match: {
    //         $and: [
    //           { slug: { $nin: [query.slug] } },
    //           { 'nextHigherAssemblies.partNumber': { $in: nextHigherAssembliesPartNumbers } },
    //         ],
    //       },
    //     },
    //     // { $limit: 6 },
    //   ]
    //   const relatedDocs = await fetchAll(event, pipeline, 'products')
    //   return relatedDocs
  } catch (err) {
    return errorHandler(event, err)
  }
})
