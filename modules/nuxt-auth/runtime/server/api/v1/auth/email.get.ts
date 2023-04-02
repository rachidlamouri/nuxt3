import errorHandler from '~/utils/errorHandler'
import { findByEmail } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const { email } = getQuery(event)
    const result = await findByEmail(event, email as string)
    if (result && Object.keys(result) && Object.keys(result).length > 0) return true
    return false
  } catch (err) {
    return errorHandler(event, err)
  }
})
