import errorHandler from '~/utils/errorHandler'
import { findUserByEmail } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const { email } = getQuery(event)
    if (await findUserByEmail(event, email as string)) return true
    return false
  } catch (err) {
    return errorHandler(event, err)
  }
})
