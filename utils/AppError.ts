class AppError extends Error {
  // custom: boolean
  name: string
  constructor(message: string, public errorCode: string, public statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    // this.custom = true
    this.name = 'CustomError'
    this.message = message ? message : 'Something went terribly wrong'
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
