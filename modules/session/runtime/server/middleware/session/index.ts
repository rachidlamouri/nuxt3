import { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  console.log('Hello from session middleware')
})
