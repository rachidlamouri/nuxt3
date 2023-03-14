import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
import { H3Event } from 'h3'
import { promisify } from 'util'
import { findById } from '~/server/controllers/v1/factory'

import AppError from '~/utils/AppError'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import errorHandler from '~/utils/errorHandler'
import sendEmail from '~/utils/Email'
import { IUser } from '~/utils/types'
// import { authUserSchema } from '~~/utils/schema'

const config = useRuntimeConfig()

const getSinedJwtToken = async function (id: any, maxAge: number) {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: maxAge })
}

const hashPassword = async (password: string = '4zE_h2n-mdWaZ9aq&3!G[Y{A,u"_xPvSD"a3q$B') => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password as string, salt)
}

const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

const hasPasswordChanged = async (JWTTimestamp: number, user: any) => {
  if (user.passwordChangeDate) {
    return parseInt(user.passwordChangeDate.getTime(), 10) / 1000 > JWTTimestamp
  }
  return false
}

const setAuthCookie = (event: H3Event, cookieName: string, cookieValue: string, maxAge: number, httpOnly = false) => {
  setCookie(event, cookieName, cookieValue, {
    maxAge,
    // httpOnly,
    // path: '/',
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    // secure: true,
  })
}

const findByEmail = async (email: string) => {
  return await mongoClient.db().collection('users').findOne({ email })
}

const createUser = async (payload: Partial<IUser>) => {
  return await mongoClient
    .db()
    .collection('users')
    .insertOne({
      name: payload.name,
      email: payload.email,
      userAddresses: payload.userAddresses || [],
      phoneNumber: payload.phoneNumber || '',
      media: [],
      role: 'customer',
      password: await hashPassword(payload.password),
      active: false,
      verified: false,
      accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
      signupDate: new Date(Date.now()),
      passwordChangeDate: new Date(Date.now()),
    })
}

const UpdateUserById = async (id: ObjectId, payload: object) => {
  return await mongoClient
    .db()
    .collection('users')
    .updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: payload }
    )
}

const sendRegistrationVerifyEmail = async (url: string, name: string, email: string, userId: ObjectId) => {
  const token = await getSinedJwtToken(userId, Number(config.jwtSignupTokenMaxAge))
  await new sendEmail({
    name,
    email,
    url,
    token,
  }).sendRegisterationEmail()
}

// const verify = async (event: H3Event) => {
//   try {
//     const payload = await readBody(event)
//     const query = getQuery(event)
//     // const decoded = await promisify(jwt.verify(query.signupToken as string, config.jwtSecret, {}))
//     const decoded = jwt.verify(query.signupToken as string, config.jwtSecret, {})
//     const user = await mongoClient
//       .db()
//       .collection('users')
//       .findOne({
//         _id: new ObjectId((decoded as JwtPayload).id),
//       })
//     if (!user) throw new AppError('Invalid registration token.', 404)
//     if (user.email !== payload.email)
//       throw new AppError(
//         'We were not able to vefify your email.  Please try a different email address or contact customer serveice at 555-555-5555',
//         404
//       )
//     const verified = await mongoClient
//       .db()
//       .collection('users')
//       .updateOne(
//         {
//           _id: new ObjectId(user._id),
//         },
//         { $set: { verified: true } }
//       )

//     if (!verified)
//       throw new AppError(
//         'We were not able to update your records, please contact customer serveice at 555-555-5555',
//         404
//       )
//     return true
//     // {
//     //   userId: user._id,
//     //   name: user.name as string,
//     //   email: user.email as string,
//     //   token: '',
//     //   isAuthenticated: false,
//     // }
//   } catch (err) {
//     return errorHandler(event, err)
//   }
// }

const refreshSignupToken = async (event: H3Event) => {
  try {
    const payload = await readBody(event)
    console.log(payload)
    const user = await findByEmail(payload.email)
    if (!user) throw new AppError('We are not able to find a user with this email.  Please try a different email', 400)
    const token = await getSinedJwtToken(user._id, Number(config.jwtSignupTokenMaxAge) * 60 * 60 * 24)
    sendRegistrationVerifyEmail(event.node.req.headers.origin!, payload.name, payload.email, token)
    return true
    // {
    //   userId: user._id,
    //   name: user.name as string,
    //   email: user.email as string,
    //   token: '',
    //   isAuthenticated: false,
    // }
  } catch (err) {
    return errorHandler(event, err)
  }
}

// const signin = async (event: H3Event) => {
//   try {
//     // return 'hello'
//     const { email, password } = await readBody(event)
//     if (!email || !password) throw new AppError('Email and Password are required', 404)
//     const user = await mongoClient.db().collection('users').findOne({ email })
//     if (!user) throw new AppError('Invalid login data', 401)
//     if (!(await checkPassword(password, user.password))) throw new AppError('Invalid email or password.', 401)
//     if (!user.verified) throw new AppError('notVerified', 401)
//     const token = await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60)
//     // const user = {
//     //   // userId: user._id,
//     //   name: user.name as string,
//     //   email: user.email as string,
//     //   token: await getSinedJwtToken(user._id, Number(config.jwtMaxAge) * 24 * 60 * 60),
//     //   isAuthenticated: true,
//     // }
//     setAuthCookie(event, 'authToken', token, Number(config.jwtMaxAge) * 24 * 60 * 60)
//     return token
//   } catch (err) {
//     return errorHandler(event, err)
//   }
// }

// const signout = async (event: H3Event) => {
// try {
//   // if (event.context.auth) {
//   setAuthCookie(event, 'user', '', 1)
//   // }
//   return true
//   // {
//   //   userId: new ObjectId(),
//   //   name: '',
//   //   email: '',
//   //   token: '',
//   //   isAuthenticated: false,
//   // }
// } catch (err) {
//   errorHandler(event, err)
// }
// }

// const forgotPassword = async (event: H3Event) => {
//   try {
//     const body = await readBody(event)
//     console.log('Bodyxxxx', body)
//     const { email } = body
//     if (!email) throw new AppError('email is required', 404)
//     const user = await mongoClient.db().collection('users').findOne({ email })
//     if (!user) throw new AppError('We cannot find a user with this email in our database', 404)
//     if (!user.verified) throw new AppError('notVerified', 404)
//     const resetToken = crypto.randomBytes(32).toString('hex')
//     user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//     user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 24 * 60 * 60 * 1000)
//     // user.passwordResetExpires = new Date(Date.now() + Number(config.pwResetTokenExpiresIn) * 30 * 1000)
//     const updatedUser = await mongoClient
//       .db()
//       .collection('users')
//       .replaceOne({ _id: new ObjectId(user._id) }, user)
//     console.log('US', updatedUser)
//     if (!updatedUser) throw new AppError('We cannot update document', 404)
//     await new sendEmail({
//       name: user.name as string,
//       email: user.email as string,
//       url: event.node.req.headers.origin,
//       token: resetToken,
//     }).sendPasswordResetEmail()

//     return true
//     // {
//     //   userId: new ObjectId(),
//     //   name: '',
//     //   email: '',
//     //   token: '',
//     //   isAuthenticated: false,
//     // }
//   } catch (err) {
//     return errorHandler(event, err)
//   }
// }

// const resetPassword = async (event: H3Event) => {
//   try {
//     const body = await readBody(event)
//     const query = getQuery(event)
//     console.log('Body "]', body)
//     console.log('Query', query)
//     const { password } = body
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(query.passwordResetToken as string)
//       .digest('hex')
//     const user = await mongoClient
//       .db()
//       .collection('users')
//       .findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date(Date.now()) }, verified: true })
//     console.log('US', user)
//     if (!user) throw new AppError('Invalid password reset token', 'invalid_password_reset_token', 404)
//     user.password = await hashPassword(password)
//     user.passwordChangeDate = new Date(Date.now())
//     delete user.passwordResetToken
//     delete user.passwordResetExpires
//     const updatedUser = await mongoClient
//       .db()
//       .collection('users')
//       .replaceOne({ _id: new ObjectId(user._id) }, user)
//     console.log('USMOD', updatedUser)
//     if (!updatedUser)
//       throw new AppError('We are not able to reset your password at this time', 'password_reset_failed', 404)
//     await new sendEmail({
//       name: user.name,
//       email: user.email as string,
//       url: event.node.req.headers.origin,
//       token: '',
//     }).sendPasswordResetSuccessEmail()
//     return true
//     // {
//     //   userId: new ObjectId(),
//     //   name: user.name as string,
//     //   email: user.email as string,
//     //   token: '',
//     //   isAuthenticated: false,
//     // }
//   } catch (err) {
//     return errorHandler(event, err)
//   }
// }

const protect = async (event: H3Event) => {
  try {
    const authToken = parseCookies(event).authToken || ''
    const decoded = jwt.verify(authToken, config.jwtSecret, {})
    const user = await findById('users', (decoded as JwtPayload).id)
    if (user) return true
    return false
  } catch (err) {
    return errorHandler(event, err)
  }
}

export {
  findByEmail,
  // signup,
  refreshSignupToken,
  // verify,
  // signin,
  // signout,
  // forgotPassword,
  // resetPassword,
  createUser,
  UpdateUserById,
  hashPassword,
  checkPassword,
  getSinedJwtToken,
  setAuthCookie,
  sendRegistrationVerifyEmail,
  hasPasswordChanged,
  protect,
  // getAuth,
}
