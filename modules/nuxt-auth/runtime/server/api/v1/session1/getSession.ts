export default defineEventHandler((event) => {
  console.log('HHHHHERE')
  return event.context.session
})
