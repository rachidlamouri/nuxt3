import emailTemplateBase from '~/modules/nuxt-mailer/runtime/emailTemplates/base'
import emailTemplateRegistration from '~/modules/nuxt-mailer/runtime/emailTemplates/registration'
import { sendMail } from '#mailer'
import { createUser, getSinedJwtToken } from '~/server/controllers/v1/auth'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { userRepository, EntityId } from '~/server/redisSchemas/user'
// import { createClient } from 'redis'
import { redis } from '~/utils/redisClient'

// import { Schema, Repository, EntityId } from 'redis-om'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    // const redis = createClient({
    //   url: process.env.NUXT_REDIS_URL as string,
    // })
    await redis.connect()
    const user = await userRepository.save(await readBody(event))
    console.log('E', user[EntityId])

    // console.log(await userRepository.fetch(user[EntityId]))
    return user[EntityId]

    const { insertedId } = await createUser(body)
    if (!insertedId)
      throw new AppError('Registration failed.  Please try a different email', 'registration_failed', 400)
    const emailBody = emailTemplateRegistration(
      body.name,
      event.node.req.headers.origin!,
      await getSinedJwtToken(insertedId, Number(config.jwtSignupTokenMaxAge))
    )
    const info = await sendMail(body.email, config.nuxtMailer.registrationEmailSubject, emailTemplateBase(emailBody))
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  } catch (err) {
    return errorHandler(event, err)
  }
})
