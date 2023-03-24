import errorHandler from '~/utils/errorHandler'
import AppError from '~/utils/AppError'
import { setAuthCookie, findById } from '~/server/controllers/v1/auth'
import stripe from 'stripe'
import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { parseCookies, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const config = useRuntimeConfig()

    const body = await readBody(event)

    // console.log('YYYYY', body)

    const order = await mongoClient
      .db()
      .collection('orders')
      .findOne({
        _id: new ObjectId(body.cartId),
      })
    if (!order) throw new AppError('We are not able to find your cart.', 404)

    // console.log('ORDER', order)

    const { client_secret } = await stripe(config.stripeSk).paymentIntents.create({
      amount: Math.floor(order.total),
      // amount: body.amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })
    return client_secret
  } catch (err) {
    errorHandler(event, err)
  }
})
