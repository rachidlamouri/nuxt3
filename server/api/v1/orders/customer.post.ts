import { IUser } from '~/utils/types'
import { mongoClient, ObjectId } from '~~/utils/mongoClient'
// import isEqual from 'lodash.isequal'
import errorHandler from '~/utils/errorHandler'
import {
  hashPassword,
  findByEmail,
  createUser,
  UpdateUserById,
  sendRegistrationVerifyEmail,
} from '~/server/controllers/v1/auth'
import { IAddress } from '~/utils/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  // try {
  //   const body = await readBody(event)
  //   return body
  //   let userId
  //   const customer = await findByEmail(body.email)
  //   if (customer) {
  //     if (body.userAddresses && body.userAddresses.length && body.userAddresses[0].country) {
  //       const country = await mongoClient
  //         .db()
  //         .collection('countries')
  //         .findOne({
  //           _id: new ObjectId(body.userAddresses[0].country._id),
  //         })
  //       if (country) body.userAddresses[0].country = country._id
  //     }
  //     if (body.phoneNumbers && body.phoneNumbers.length && body.phoneNumbers[0].phoneCountry) {
  //       const country = await mongoClient
  //         .db()
  //         .collection('countries')
  //         .findOne({
  //           _id: new ObjectId(body.phoneNumbers[0].phoneCountry._id),
  //         })
  //       if (country) body.phoneNumbers[0].phoneCountry = country._id
  //     }
  //     if (body.userAddresses && body.userAddresses.length && body.userAddresses[0].provence) {
  //       const provence = await mongoClient
  //         .db()
  //         .collection('provences')
  //         .findOne({
  //           _id: new ObjectId(body.userAddresses[0].provence._id),
  //         })
  //       if (provence) body.userAddresses[0].provence = provence._id
  //     }
  //     const addressIndex = customer.userAddresses.findIndex((a: Partial<IAddress>) => isEqual(a, body.userAddresses[0]))
  //     if (addressIndex === -1) {
  //       if (customer.userAddresses && customer.userAddresses.length < 20)
  //         customer.userAddresses.push({ ...body.userAddresses[0] })
  //       else customer.userAddresses[0] = { ...body.userAddresses[0] }
  //     }
  //     const phoneIndex = customer.phoneNumbers.findIndex((p: IPhoneNumber) => isEqual(p, body.phoneNumbers[0]))
  //     if (phoneIndex === -1) {
  //       if (customer.phoneNumbers && customer.phoneNumbers.length < 20)
  //         customer.phoneNumbers.push({ ...body.phoneNumbers[0] })
  //       else customer.phoneNumbers[0] = { ...body.phoneNumbers[0] }
  //     }
  //     const result = await UpdateUserById(customer._id, {
  //       userAddresses: customer.userAddresses,
  //       phoneNumbers: customer.phoneNumbers,
  //       password: await hashPassword(body.password),
  //     })
  //     userId = customer._id
  //   } else {
  //     const { insertedId } = await createUser({
  //       name: body.name,
  //       email: body.email,
  //       password: body.password,
  //       userAddresses: body.userAddresses,
  //       phoneNumbers: body.phoneNumbers,
  //     })
  //     if (insertedId) {
  //       userId = insertedId
  //       sendRegistrationVerifyEmail(event.node.req.headers.origin!, body.name, body.email, insertedId)
  //     }
  //   }
  //   const cursor = mongoClient
  //     .db()
  //     .collection('users')
  //     .find({ _id: userId })
  //     .project({ name: 1, email: 1, userAddresses: 1, phoneNumbers: 1 })
  //   if (cursor) {
  //     const customer = await (cursor.toArray() as Promise<Array<IUser>>)
  //     return customer ? customer[0] : {}
  //   }
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
})
