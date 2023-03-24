import jwt, { JwtPayload } from 'jsonwebtoken'
import cloneDeep from 'lodash.clonedeep'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import { publicUserSchema } from '~/utils/schema'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const query = { ...getQuery(event) }
    if (!query.authToken) return {}
    const authToken = query.authToken
    const decoded = jwt.verify(authToken as string, config.jwtSecret, {})
    const user = await mongoClient
      .db()
      .collection('users')
      .findOne({
        _id: new ObjectId((decoded as JwtPayload).id),
      })
    if (!user) return {}
    return {
      name: user.name,
      email: user.email,
      userAddresses: user.userAddresses,
      phoneNumber: user.phoneNumber,
      media: user.media,
    }
  } catch (err) {
    return errorHandler(event, err)
  }
})
