import { H3Event } from 'h3'

const config = useRuntimeConfig()

const setAuthCookie = (
  event: H3Event,
  cookieName: string,
  cookieValue: string,
  options: { maxAge: number; httpOnly?: boolean; path?: string; secure?: boolean }
) => {
  setCookie(event, cookieName, cookieValue, {
    maxAge: options.maxAge ? options.maxAge : 1,
    httpOnly: options.httpOnly ? options.httpOnly : false,
    path: options.path ? options.path : '/',
    secure: options.secure ? options.secure : false,
  })
  console.log('GGGGGGG')
}

export { setAuthCookie }
