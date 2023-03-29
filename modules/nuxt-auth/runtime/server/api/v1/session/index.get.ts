import { getUserSession } from '#auth'

export default eventHandler(async (event) => {
  console.log('JKL:')
  return await getUserSession(event)
})
