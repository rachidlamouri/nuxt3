import { H3Event } from 'h3'
// import { sendError, createError,  } from 'h3'
// import colors from 'colors'
import { ZodError } from 'zod'

// interface IAppErrorErrors {
//   path: any
//   value: any
//   message: string
// }

// interface ReturnError {
//   status: string
//   statusCode: number
//   errors: Array<IAppErrorErrors>
//   message?: string
//   err: Error
// }

const errorHandler = (event: H3Event, err: any) => {
  console.log(`ERR ${err.name}`, err)
  // console.log(colors.red.bold(`ERR ${err}`), err.name)
  // console.log(colors.red.bold(`ERRCODE ${err}.code`), err.code)
  // console.log('INFO', err.errorInfo

  let message = ''
  let statusCode = 400
  let errorCode = ''
  // let data: any

  // if (err instanceof ZodError) {
  //   // console.log('ZODXXX', err.issues)

  //   const formattedErrors = err.issues

  //   type zoDErrorItem = {
  //     [key: string]: { message: string }
  //   }

  //   // let message = ''
  //   for (const item of formattedErrors) {
  //     // console.log('ITEM', item)
  //     message += `${item.message} | `
  //   }

  //   // console.log('MMMMM', message)
  //   // console.log('MMMMMmmmmmmmm')
  // }

  if (
    err.name === 'CustomError' ||
    err.name === 'TokenExpiredError' ||
    err.name === 'TypeError' ||
    err.name === 'ReferenceError'
  ) {
    message = err.message
    statusCode = err.statusCode
    // console.log('YYYYYY', err)
    // if (err.message === 'notVerified') {
    //   errorCode = err.message
    //   message = 'You have not verified your email.  Please verify your email'
    // }

    // if (err.message === 'invalidPasswordResetToken') {
    //   errorCode = err.message
    //   message = 'Your password reset token is invalid or has expired'
    // }
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired.'
    statusCode = err.statusCode
    errorCode = 'invalidToken'
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token.'
    statusCode = err.statusCode
    errorCode = 'invalidToken'
  }

  if (err.name === 'MongoServerError' || err.name === 'MongoBulkWriteError') {
    if (err.code === 11000) {
      if (err.keyValue) {
        message = `${Object.values(err.keyValue)[0]} already exists, please select a different ${
          Object.keys(err.keyValue)[0]
        }.`
      } else {
        message = err.message
      }
      statusCode = 422
      errorCode = 'notUnique'
    }

    if (err.code === 121) {
      console.log('GGGGGGGG', err.writeErrors)
      const writeErrors = err.writeErrors
      if (writeErrors && writeErrors.length) {
        for (const writeError of writeErrors) {
          console.log('WWWWW', writeError.err.errInfo.details.schemaRulesNotSatisfied)
          const schemaRulesNotSatisfied = writeError.err.errInfo.details.schemaRulesNotSatisfied
          for (const property of schemaRulesNotSatisfied) {
            if (property.missingProperties) message += `${property.missingProperties.join(',')} are required`
          }
        }
      }
      const schemaRulesNotSatisfied = err.errInfo.details.schemaRulesNotSatisfied
      if (schemaRulesNotSatisfied && schemaRulesNotSatisfied.length) {
        for (const i in schemaRulesNotSatisfied) {
          // if (schemaRulesNotSatisfied[i].operatorName === 'required') {
          //   for (const j in schemaRulesNotSatisfied[i].missingProperties) {
          //     message += `${schemaRulesNotSatisfied[i].missingProperties[j]} is required<br>`
          //   }
          // }
          // if (schemaRulesNotSatisfied[i].operatorName === 'properties') {
          // console.log('MMMMM', schemaRulesNotSatisfied[i].operatorName)
          const propertiesNotSatisfied = schemaRulesNotSatisfied[i].propertiesNotSatisfied
          if (propertiesNotSatisfied) {
            for (const j in propertiesNotSatisfied) {
              const details = propertiesNotSatisfied[j].details
              for (const k in details) {
                message += `${details[k].consideredValue} is not a valid ${propertiesNotSatisfied[j].propertyName}.`

                // message += `${details[k].operatorName}: ${details[k].reason} ${propertiesNotSatisfied[j].propertyName}=${details[k].consideredValue} <br>`

                // console.log('KKKKK', message)
              }
            }
            // }
          }
          if (schemaRulesNotSatisfied[i].missingProperties) {
            for (const j in schemaRulesNotSatisfied[i].missingProperties) {
              message = `${schemaRulesNotSatisfied[i].missingProperties[j]} is required`
              // for (const k in schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details) {
              //   message += `${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].operatorName}: ${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].reason} ${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].propertyName}=${schemaRulesNotSatisfied[i].propertiesNotSatisfied[j].details[k].consideredValue} <br>`
              //   console.log('KKKKK', message)
              // }
            }
            // }
          }
        }
      }
    }
  }
  // console.log('MMMMM', message)

  return sendError(
    event,
    createError({
      statusCode: statusCode,
      statusMessage: message,
      data: { ...err, name: err.name, message: message },
    })
  )
}

export default errorHandler
