import { mongoClient, ObjectId } from '~~/utils/mongoClient'
import errorHandler from '~~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const cursor = mongoClient.db().collection('provences').find()
    const docs = await cursor.toArray()
    return docs
  } catch (err) {
    return errorHandler(event, err)
  }

  // const query = { ...getQuery(event) }
  // console.log('Query', query)

  // switch (query.action) {
  //   case 'signup':
  //     return signup(event)
  //     break

  //   case 'verify':
  //     return verify(event)
  //     break

  //   case 'signin':
  //     return signin(event)
  //     break

  //   case 'signout':
  //     return signout(event)
  //     break

  //   case 'forgotPassword':
  //     return forgotPassword(event)
  //     break

  //   case 'resetPassword':
  //     return resetPassword(event)
  //     break

  //   default:
  //     break
  // }
})
