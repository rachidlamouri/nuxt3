import { emailPattern, passwordPattern } from '~/utils/patterns'
import redis from '~/utils/redisClient'
import { Schema, Repository, EntityId } from 'redis-om'

const userSchema = new Schema('User', {
  accountNumber: { type: 'number' },
  name: { type: 'string' },
  email: { type: 'string' },
  media: { type: 'string[]' },
  password: { type: 'string' },
  nonce: { type: 'string' },
  role: {
    type: 'string', // enum: ['super-admin', 'admin', 'shop-manager', 'customer']},
  },
  active: { type: 'boolean' },
  verified: { type: 'boolean' },
  signupDate: { type: 'number' },
  passwordChangeDate: { type: 'number' },
  passwordResetToken: { type: 'string' },
  passwordResetExpiryDate: { type: 'number' },
  salutation: {
    type: 'string',
  },
  userAddresses: { type: 'string[]' },
  //   userAddresses:[
  //   addressType: {
  //     type: 'string',
  //     enum: ['Residential', 'Commercial'],
  //     description: 'Address type and is required',
  //   },
  //   name: {
  //     type: 'string',

  //     maxLength: 50,
  //   },
  //   company: {
  //     type: 'string',

  //     maxLength: 50,
  //   },
  //   country: {
  //     type: 'string',

  //     // maxLength: 20,
  //   },
  //   street: {
  //     type: 'string',
  //     maxLength: 100,
  //   },
  //   street2: {
  //     type: 'string',
  //     maxLength: 100,
  //   },
  //   city: {
  //     type: 'string'
  //   },
  //   provence: {
  //     type: 'string',
  //    // maxLength: 20,
  //   },
  //   postalCode: {
  //     type: 'string',
  //   },
  //   isDefaultShiping: {
  //     type: 'boolean',
  //   },
  //   isDefaultBilling: {
  //     type: 'boolean',
  //   },
  // ]
})

const userRepository = new Repository(userSchema, redis)

const createUserIndex = async () => {
  await redis.connect()
  await userRepository.createIndex()
  await redis.disconnect()
}

createUserIndex()

export { userRepository, EntityId }

// export default {
//   validator: {
//     $jsonSchema: {
//       required: [
//         'name',
//         'email',
//         'role',
//         'password',
//         'verified',
//         'active',
//         'accountNumber',
//         'passwordChangeDate',
//         'signupDate',
//       ],
//       properties: {
//
//
//         userAddresses: {
//           bsonType: 'array',
//           description: 'User shipping addresses',
//           required: [
//             'addressType',
//             'name',
//             'country',
//             'street',
//             'city',
//             'provence',
//             'postalCode',
//             'isDefaultBilling',
//             'isDefaultShiping',
//           ],
//           properties: {
//             // _id: {
//             //   bsonType: 'objectId',
//             // },
//             scription: 'True if address is the default shipping addrreess',
//             },
//             // deliveryInstructions: {
//             //   bsonType: 'string',
//             //   description: 'Delivery instructions is required and 200 characters max',
//             //   maxLength: 2000,
//             // },
//           },
//         },

//         phoneNumber: {
//           bsonType: 'string',
//           description: 'User phone number ',
//           maxLength: 20,
//         },
//         // phoneNumbers: {
//         //   bsonType: 'array',
//         //   description: 'User phonenumbers',
//         //   required: ['phoneType', 'phoneCountryCode', 'phoneNumber', 'isDefault'],
//         //   properties: {
//         //     _id: {
//         //       bsonType: 'objectId',
//         //     },
//         //     phoneType: {
//         //       bsonType: 'string',
//         //       description: 'User address title is required and 200 characters max',
//         //       maxLength: 5,
//         //     },
//         //     phoneCountry: {
//         //       bsonType: 'object',
//         //       description: 'phone country code is required and 200 characters max',
//         //       // maxLength: 20,
//         //     },
//         //     phoneNumber: {
//         //       bsonType: 'string',
//         //       description: 'User phone number is required and 200 characters max',
//         //       maxLength: 50,
//         //     },
//         //     isDefault: {
//         //       bsonType: 'bool',
//         //       description: 'Default phone number',
//         //     },
//         //   },
//         // },
//       },
//     },
//   },
// }

// export default userSchema
