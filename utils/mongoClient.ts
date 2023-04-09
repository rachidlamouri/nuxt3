import { MongoClient } from 'mongodb'

export const buildMongoClient = () => {
  const mongoClient = new MongoClient(process.env.NUXT_DB_URL as string)
  return mongoClient;
}
