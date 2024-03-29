import { ObjectId } from 'mongodb'
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from '~/utils/AppError'
import { mongoClient } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    const decoded = jwt.verify(query.signupToken as string, config.jwtSecret, {})
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId((decoded as JwtPayload).id),
      })
    if (!user) throw new AppError('Invalid registration token', 'invalid_signup_token', 404)
    if (user.email !== body.email)
      throw new AppError(
        'We were not able to vefify your email.  Please try a different email address or contact customer serveice at 555-555-5555',
        'verify_email_not_found',
        404
      )
    const verified = await mongoClient
      .db()
      .collection('users')
      .updateOne(
        {
          _id: new ObjectId(user._id),
        },
        { $set: { verified: true } }
      )

    if (!verified)
      throw new AppError(
        'We were not able to update your records, please contact customer serveice at 555-555-5555',
        'verify_signup_failed',
        404
      )
    return { userId: user._id }
  } catch (err) {
    return errorHandler(event, err)
  }
})
