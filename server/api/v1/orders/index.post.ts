import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import { setAuthCookie } from '~/server/controllers/v1/auth'
import { findById, createDocument } from '~/server/controllers/v1/factory'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('BODY', body)

    const cartId = parseCookies(event).cartId
    if (!cartId) {
      console.log('NO ID')
      const { insertedId } = await createDocument('orders', body)
      return insertedId
      // const { insertedId } = await mongoClient.db().collection('orders').insertOne(body)
      // setAuthCookie(event, 'cartId', insertedId.toString(), Number(config.jwtMaxAge) * 24 * 60 * 60)
      // return insertedId
    }
    const order = await findById('orders', cartId)
    console.log('CCCC', order)
    if (!order) {
      console.log(' ID NO ORDER')
      const { insertedId } = await createDocument('orders', body)
      return insertedId

      // const { insertedId } = await mongoClient.db().collection('orders').insertOne(body)
      // setAuthCookie(event, 'cartId', insertedId.toString(), Number(config.jwtMaxAge) * 24 * 60 * 60)
      // return insertedId
    }
    console.log(' ID AND ORDER')
    const result = await mongoClient
      .db()
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(cartId) },
        {
          $set: {
            total: body.total,
            status: body.status,
            items: body.items,
            customer: {
              name: body.customer.name ? body.customer.name : '',
              email: body.customer.email ? body.customer.email : '',
              phoneNumber: body.customer.phoneNumber ? body.customer.phoneNumber : '',
            },
            billingAddress: body.billingAddress,
            shippingAddress: body.shippingAddress,
          },
        }
      )
    return cartId
  } catch (err) {
    return errorHandler(event, err)
  }
})
