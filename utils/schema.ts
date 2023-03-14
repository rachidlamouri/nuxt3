import { z } from 'zod'
import { passwordPattern } from '~/utils/patterns'

// Email schema
export const emailSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .email({ message: 'Please enter a valid email' }),
})

// password schema
export const passwordSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .regex(new RegExp(passwordPattern, 'i'), { message: 'Please enter a valid password' }),
})

// Registration user schema
export const signupUserSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .nonempty({ message: 'Name is required' })
    .max(40, { message: 'Name must be 4 or fewer characters' }),
  email: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .regex(new RegExp(passwordPattern, 'i'), { message: 'Please enter a valid password' }),
})
export type ISignupUser = z.infer<typeof signupUserSchema>

// Login user schema
export const signinUserSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .regex(new RegExp(passwordPattern, 'i'), { message: 'Please enter a valid password' }),
})
export type ISigninUser = z.infer<typeof signinUserSchema>

// Authenticated user schema
export const authenticatedDataSchema = z.object({
  authToken: z.string().optional(),
  name: z.string().optional(),
  cookieMaxAge: z.number().optional(),
  // isAuthenticated: z.boolean().default(false),
})
export type IAuthenticatedData = z.infer<typeof authenticatedDataSchema>

// Product schema
export const productSchema = z.object({
  _id: z.string(),
  acsPartNumber: z.string(),
  sku: z.string(),
  tbq: z.string(),
  slug: z.string(),
  price: z.number(),
  salePrice: z.number(),
  qtySold: z.number(),
  description: z.string(),
  status: z.string(),
  media: z.array(z.object({ name: z.string(), slug: z.string() })),
  oem: z.string(),
  oemPartNumber: z.string(),
  eligibilities: z.array(z.object({ name: z.string(), slug: z.string() })),
  nextHigherAssemblies: z.array(z.object({ name: z.string(), slug: z.string(), partNumber: z.string() })),
})
export type IProduct = z.infer<typeof productSchema>

// Cart item schema
export const cartItemSchema = productSchema.extend({ quantity: z.number().int().positive() })
export type ICartItem = z.infer<typeof cartItemSchema>

// // Address schema
// export const userAddressSchema = z.object({
//   salutation: z.string(),
//   addressType: z.enum(['Residential', 'Commercial']),
//   name: z.string(),
//   compnay: z.string(),
//   country: z.string(),
//   street: z.string(),
//   street2: z.string(),
//   city: z.string(),
//   provence: z.string(),
//   postalCode: z.string(),
//   defaultBilling: z.boolean(),
//   defaultShipping: z.boolean(),
// })
// export type IUserAddress = z.infer<typeof userAddressSchema>

/************ User schema **************/
export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .email({ message: 'Please enter a valid email' }),
  password: z.string(),
  userAddresses: z.array(
    z.object({
      salutation: z.string(),
      addressType: z.enum(['Residential', 'Commercial']),
      name: z.string(),
      compnay: z.string(),
      country: z.string(),
      street: z.string(),
      street2: z.string(),
      city: z.string(),
      provence: z.string(),
      postalCode: z.string(),
      defaultBilling: z.boolean(),
      defaultShipping: z.boolean(),
    })
  ),
  phoneNumber: z.string(),
  media: z.array(z.string()),
  role: z.string(),
  active: z.boolean(),
  verified: z.boolean(),
  signupDate: z.date(),
  passwordChangeDate: z.date(),
})
export type IUser = z.infer<typeof userSchema>

/************ User address schema **************/
export const userAddressSchema = userSchema.shape.userAddresses.element
export type IUserAddress = z.infer<typeof userAddressSchema>

// Public User schema
export const publicUserSchema = userSchema.pick({
  _id: true,
  name: true,
  email: true,
  userAddresses: true,
  phoneNumber: true,
  media: true,
})
export type IPublicUser = z.infer<typeof publicUserSchema>

/************ Cart schema **************/
export const cartSchema = z.object({
  _id: z.string(),
  items: z.array(
    z.object({
      _id: z.string(),
      acsPartNumber: z.enum(['Residential', 'Commercial']),
      price: z.number(),
      salePrice: z.number(),
      tbq: z.boolean(),
    })
  ),
  name: z.string(),
  email: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .email({ message: 'Please enter a valid email' }),
  password: z.string(),
  userAddresses: z.array(
    z.object({
      salutation: z.string(),
      addressType: z.enum(['Residential', 'Commercial']),
      name: z.string(),
      compnay: z.string(),
      country: z.string(),
      street: z.string(),
      street2: z.string(),
      city: z.string(),
      provence: z.string(),
      postalCode: z.string(),
      defaultBilling: z.boolean(),
      defaultShipping: z.boolean(),
    })
  ),
  phoneNumber: z.string(),
  media: z.array(z.string()),
  role: z.string(),
  active: z.boolean(),
  verified: z.boolean(),
  signupDate: z.date(),
  passwordChangeDate: z.date(),
})
export type ICart = z.infer<typeof userSchema>
