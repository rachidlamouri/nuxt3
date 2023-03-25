import AppError from '~/utils/AppError'
import { findByEmail } from '~/server/controllers/v1/auth'
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const user = await findByEmail(body.email as string)
    if (user) return { userId: user._id }
    console.log('FETCHUSER')
    return { userId: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
