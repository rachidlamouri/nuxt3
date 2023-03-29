import errorHandler from '~/utils/errorHandler'
import { findByEmail } from '~/server/controllers/v1/factory'

export default defineEventHandler(async (event) => {
  try {
    const { email } = getQuery(event)
    const user = await findByEmail(email as string)
    if (user && Object.keys(user) && Object.keys(user).length > 0) return true
    return false
  } catch (err) {
    return errorHandler(event, err)
  }
})
