import { getUserSession } from '#auth'

export default eventHandler(async (event) => {
  // console.log('JKL:', await getUserSession(event))
  return await getUserSession(event)
})
