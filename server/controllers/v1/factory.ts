import { Repository } from 'redis-om'

import jwt, { JwtPayload } from 'jsonwebtoken'

// import { fetchAll } from '~/server/controllers/v1/products'
import { H3Event } from 'h3'
import { mongoClient, ObjectId } from '~/utils/mongoClient'
import AppError from '~/utils/AppError'
import errorHandler from '~/utils/errorHandler'
import { redis } from '~/utils/redisClient'
import { userRepository, EntityId } from '~/server/redisSchemas/user'
import { IUser } from '~/utils/schema'

const config = useRuntimeConfig()

const aggregateFetch = async (event: H3Event, collection: string, lookup: object[] = [], unwind: object[] = []) => {
  try {
    const query = { ...getQuery(event) }

    // console.log('Q', query)

    const pipeline = []

    // MATCH
    if (query.match) {
      const matchObj = (query.match as string)
        .split(',')
        .map((p) => p.trim().split('='))
        .reduce((arrr: any, arr: any) => {
          const parts: any = arr[0].split('[')
          if (parts.length > 1) arrr.push({ [arr[0].split('[')[0]]: { [arr[0].split('[')[1].split(']')[0]]: +arr[1] } })
          else arrr.push({ [arr[0].split('[')[0]]: arr[1] })
          return arrr
        }, [])
      pipeline.push({
        $match: {
          $and: JSON.parse(JSON.stringify(matchObj).replace(/\b(eq|ne|gte|gt|lte|lt)\b/g, (match) => `$${match}`)),
        },
      })
    }

    // LOOKUP
    if (lookup) {
      for (const item of lookup) {
        pipeline.push(item)
      }
    }

    // PROJECT
    if (query.project) {
      const project = (query.project as string).split(',').map((p) => p.trim())
      const projectObj = project.reduce((obj: any, item: string) => {
        obj[item] = 1
        return obj
      }, {})
      pipeline.push({ $project: projectObj })
    }

    // SORT
    if (query.sort) {
      const sortObj = (query.sort as string)
        .split(',')
        .map((p) => p.trim())
        .reduce((obj: any, item: string) => {
          obj[item.split('=')[0]] = item.split('=')[1] === 'asc' ? 1 : item.split('=')[1] === 'dsc' ? -1 : 0
          return obj
        }, {})
      pipeline.push({ $sort: sortObj })
    }

    // SKIP & LIMIT
    const page = query.page && Number(query.page) * 1 >= 1 ? Number(query.page) * 1 : 1
    const limit = query.limit && Number(query.limit) * 1 > 0 ? Number(query.limit) * 1 : 100
    const skip = (page - 1) * limit
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    // UNWIND
    if (unwind.length) {
      for (const item of unwind) {
        pipeline.push(item)
      }
    }

    // console.log(pipeline)

    const cursor = mongoClient.db().collection(collection).aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs) throw new AppError(`We were not able to fetch ${collection}`, 'unable_to_fetch', 400)
    return docs
  } catch (err) {
    return errorHandler(event, err)
  }
}

const findBySlug = async (collection: string, slug: string) => {
  return await mongoClient.db().collection(collection).findOne({ slug })
}

const createDocument = async (collection: string, doc: {}) => {
  return await mongoClient.db().collection('orders').insertOne(doc)
}

const findById = async (repository: Repository, id: string) => {
  // await redis.connect()
  const found = await repository.fetch(id)
  // await redis.disconnect()
  if (found) return found
  return {}
}

//////////////////////*************************************///////////////

const getSinedJwtToken = async function (id: any, maxAge: number) {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: maxAge })
}

export const fetchAll = async (repository: Repository) => {
  // await redis.connect()
  const found = await repository.search().return.all()
  // await redis.disconnect()
  return found
}

// export const findByEmail = async (email: string) => {
//   await redis.connect()
//   const found = await userRepository.search().where('email').eq(email).return.all()
//   await redis.disconnect()
//   if (found && Array.isArray(found) && found.length) return found[0]
//   return {}
// }

const findByIdAndUpdate = async (repository: Repository, id: string, payload: object): Promise<Partial<IUser>> => {
  // await redis.connect()
  let newEntity
  const found = await repository.fetch(id)
  if (found) newEntity = await repository.save({ ...found, ...payload })
  // await redis.disconnect()
  return newEntity as IUser
}

export { getSinedJwtToken, findById, findByIdAndUpdate, findBySlug, aggregateFetch, createDocument }
