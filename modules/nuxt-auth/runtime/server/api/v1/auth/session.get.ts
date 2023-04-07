export default defineEventHandler((event) => {
  const session = event.context.session
  if (session) return { userName: session.userName, authenticated: true }
  return {}
})
