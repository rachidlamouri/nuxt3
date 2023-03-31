import redis from '../../utils/redisClient'
import { Schema, Repository, EntityId } from 'redis-om'

const productSchema = new Schema('Product', {
  acsPartNumber: { type: 'string' },
  slug: { type: 'string' },
  media: { type: 'string[]' },
  description: { type: 'string' },
  oem: { type: 'string' },
  oemPartNumber: { type: 'string' },
  qtySold: { type: 'boolean' },
  tbq: { type: 'boolean' },
  price: { type: 'number' },
  salePrice: { type: 'number' },
  sku: { type: 'number' },
  eligibilities: { type: 'string[]' },
  nextHigherAssemblies: { type: 'string[]' },
  status: { type: 'string' },
})

const productRepository = new Repository(productSchema, redis)

// const createUserIndex = async () => {
//   await redis.connect()
//   await productRepository.createIndex()
//   await redis.disconnect()
// }

// createUserIndex()

export { productRepository, EntityId }

// export default {
//   validator: {
//     $jsonSchema: {
//       required: ['slug', 'acsPartNumber', 'media', 'oem', 'oemPartNumber'],
//       properties: {
//         // name: {
//         //   bsonType: 'string',
//         //   description: 'Product name is required and 50 characters max',
//         //   maxLength: 50,
//         // },
//         // slug: {
//         //   bsonType: 'string',
//         //   description: 'Product slug is required',
//         // },
//         // acsPartNumber: {
//         //   bsonType: 'string',
//         //   description: 'ACS part Number is required',
//         //   maxLength: 20,
//         // },
//         // media: {
//         //   bsonType: 'array',
//         //   description: 'Product images',
//         //   items: {
//         //     bsonType: 'object',
//         //     properties: {
//         //       name: {
//         //         bsonType: 'string',
//         //         description: 'Eligibility name',
//         //       },
//         //       slug: {
//         //         bsonType: 'string',
//         //         description: 'Eligibility slug',
//         //       },
//         //     },
//         //   },
//         //   // uniqueItems: true,
//         //   // items: {
//         //   //   bsonType: 'objectId',
//         //   // },
//         // },
//         // description: {
//         //   bsonType: 'string',
//         //   description: 'Product description',
//         //   maxLength: 2000,
//         // },
//         // oem: {
//         //   bsonType: 'string',
//         //   description: 'OEM',
//         //   maxLength: 100,
//         // },
//         // oemPartNumber: {
//         //   bsonType: 'string',
//         //   description: 'OEM part number',
//         //   // maxLength: 100,
//         // },
//         // qtySold: {
//         //   bsonType: 'int',
//         //   description: 'Quantity sold',
//         // },
//         // tbq: {
//         //   bsonType: 'bool',
//         //   description: 'Whether the product is to be quoted or not',
//         // },
//         // price: {
//         //   bsonType: 'number',
//         //   description: 'Product price',
//         //   maxLength: 500,
//         // },
//         // salePrice: {
//         //   bsonType: 'number',
//         //   description: 'Product sale price',
//         // },
//         sku: {
//           bsonType: 'string',
//           description: 'sku',
//         },
//         eligibilities: {
//           bsonType: 'array',
//           description: 'Product eligibilities',
//           // uniqueItems: true,
//           // items: {
//           //   bsonType: 'objectId',
//           // },
//           items: {
//             bsonType: 'objectId',
//             // properties: {
//             //   name: {
//             //     bsonType: 'objectId',
//             //     description: 'Eligibility name',
//             //   },
//             //   // slug: {
//             //   //   bsonType: 'string',
//             //   //   description: 'Eligibility slug',
//             //   // },
//             // },
//           },
//         },
//         nextHigherAssemblies: {
//           bsonType: 'array',
//           description: 'Product nextHigherAssemblies',
//           // uniqueItems: true,
//           // items: {
//           //   bsonType: 'objectId',
//           // },
//           items: {
//             bsonType: 'objectId',
//             // properties: {
//             //   partNumber: {
//             //     bsonType: 'objectId',
//             //     description: 'Assembly part Number',
//             //   },
//             //   // name: {
//             //   //   bsonType: 'string',
//             //   //   description: 'Next Higer Assembly slug',
//             //   // },
//             //   // slug: {
//             //   //   bsonType: 'string',
//             //   //   description: 'Next Higer Assembly name',
//             //   // },
//             // },
//           },
//         },

//         // sortOrder: {
//         //   bsonType: 'int',
//         //   description: 'Used to sort products',
//         // },
//         // dateCreated: {
//         //   bsonType: 'date',
//         //   description: 'Date created',
//         // },
//         // stockQty: {
//         //   bsonType: 'int',
//         //   description: 'Stock quantity',
//         // },

//         status: {
//           enum: ['Active', 'Hidden'],
//           description:
//             'Status is required and can only be one of the following: Draft, Archived, Published or Private.',
//         },
//       },
//     },
//   },
// }
