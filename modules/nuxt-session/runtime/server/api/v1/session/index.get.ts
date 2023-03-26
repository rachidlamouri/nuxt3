import { getUserSession } from '#session'

export default eventHandler((event) => {
  // console.log('EEEEEE', event.node.req.headers)

  return getUserSession(event)
})
