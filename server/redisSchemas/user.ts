import { emailPattern, passwordPattern } from '../../utils/patterns'
import { redis } from '../../utils/redisClient'
import { Schema, Repository, EntityId } from 'redis-om'

const userSchema = new Schema('user', {
  name: {
    type: 'string',
  },
  email: {
    type: 'string',
  },
  // media: {
  //   type: 'string[]',
  // },
  password: {
    type: 'string',
  },
  nonce: {
    type: 'string',
  },
})

const userRepository = new Repository(userSchema, redis)

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
//         accountNumber: {
//           bsonType: 'number',
//           description: 'User account number',
//           maxLength: 200,
//         },
//         role: {
//           type: 'string',
//           enum: ['super-admin', 'admin', 'shop-manager', 'customer'],
//           description: 'User role is required',
//         },
//         active: {
//           bsonType: 'bool',
//           description: 'Whether the user is active',
//         },
//         verified: {
//           bsonType: 'bool',
//           description: 'Whether the user is verified',
//         },
//         signupDate: {
//           bsonType: 'date',
//           description: 'User registration date',
//         },
//         passwordChangeDate: {
//           bsonType: 'date',
//           description: 'Password change date',
//         },
//         passwordResetToken: {
//           bsonType: ['string', 'null'],
//           description: 'Password reset token',
//         },
//         passwordResetExpiryDate: {
//           bsonType: ['date', 'null'],
//           description: 'Password reset token expiry',
//         },
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
//             salutation: {
//               bsonType: 'string',
//               description: 'User address title is required and 200 characters max',
//               maxLength: 5,
//             },
//             addressType: {
//               type: 'string',
//               enum: ['Residential', 'Commercial'],
//               description: 'Address type and is required',
//             },
//             name: {
//               bsonType: 'string',
//               description: 'User address name is required and 200 characters max',
//               maxLength: 50,
//             },
//             company: {
//               bsonType: 'string',
//               description: 'User address company is required and 200 characters max',
//               maxLength: 50,
//             },
//             country: {
//               bsonType: 'string',
//               description: 'User address country is required and 200 characters max',
//               // maxLength: 20,
//             },
//             street: {
//               bsonType: 'string',
//               description: 'User address line 1 is required and 200 characters max',
//               maxLength: 100,
//             },
//             street2: {
//               bsonType: 'string',
//               description: 'User address line 2 is required and 200 characters max',
//               maxLength: 100,
//             },
//             city: {
//               bsonType: 'string',
//               description: 'User address city is required and 200 characters max',
//               maxLength: 100,
//             },
//             provence: {
//               bsonType: 'string',
//               description: 'User address state is required and 200 characters max',
//               // maxLength: 20,
//             },
//             postalCode: {
//               bsonType: 'string',
//               description: 'User address postal code is required and 200 characters max',
//               maxLength: 100,
//             },
//             isDefaultShiping: {
//               bsonType: 'bool',
//               description: 'True if address is the default shipping addrreess',
//             },
//             isDefaultBilling: {
//               bsonType: 'bool',
//               description: 'True if address is the default shipping addrreess',
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
