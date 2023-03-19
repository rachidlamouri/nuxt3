import { H3Event } from 'h3'
import * as argon2 from 'argon2'

const argon2Options = {
  // cryptographically-secure salt is generated automatically
  type: argon2.argon2id, // resistant against GPU & tradeoff attacks
  hashLength: 60,
}

/**
 * Get a hashed representation of the given IP address (for GDPR compliance)
 * @param ip string|undefined The IP address to hash
 */
export const hashIpAddress = (ip: string | undefined): Promise<string | undefined> =>
  !ip ? Promise.resolve(undefined) : argon2.hash(ip, argon2Options)

/**
 * Extract the IP address from an HTTP header
 * @param header string|string[]|undefined The header value to inspect and extract the IP from
 */
const extractIpFromHeader = (header?: string | string[]): string | undefined => {
  if (Array.isArray(header)) {
    return header[0].split(',')[0]
  }

  if (typeof header === 'string') {
    return header.split(',')[0]
  }

  return undefined
}

/**
 * Get the IP address corresponding to the user's request
 * @param event H3Event Event passing through middleware
 */
export const getRequestIpAddress = (event: H3Event): string | undefined => {
  const sessionOptions = useRuntimeConfig().session.session

  const headerName = sessionOptions.ipPinning?.headerName

  if (typeof sessionOptions.ipPinning === 'object' && 'headerName' in sessionOptions.ipPinning.headerName) {
    return extractIpFromHeader(event.node.req.headers[headerName.toLowerCase()])
  }

  return event.node.req.socket.remoteAddress
}

export const getHashedIpAddress = (event: H3Event): Promise<string | undefined> => {
  return hashIpAddress(getRequestIpAddress(event))
}
