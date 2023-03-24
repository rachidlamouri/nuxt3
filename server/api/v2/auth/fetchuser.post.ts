import AppError from '~/utils/AppError'
import { findByEmail } from '~/server/controllers/v1/auth'
// import errorHandler from '~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    // throw new AppError('Token is invlaid or has expired', 404)

    const body = await readBody(event)
    const user = await findByEmail(body.email as string)
    if (user) return { userId: user._id }
    return { userId: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
