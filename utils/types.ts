import { ObjectId } from 'mongodb'
// import {IAddress} from '~/utils/IAddress'
// import IPhoneNumber from '~/types/IPhoneNumber'
export interface ICountry {
  _id?: string
  continentName: string
  countryCode: string
  countryName: string
  continentCode: string
  capitalName: string
  curencyCode: string
  phoneCode: string
  threeLetterCountryCode: string
}

export interface IProvence {
  _id?: string
  name: string
  abreviation: string
}

// export interface IPhoneNumber {
//   phoneType: string
//   phoneCountry?: ICountry
//   phoneNumber: string
//   isDefault: boolean
// }

export interface IAddress {
  salutation: string
  addressType: string
  name?: string
  company: string
  country?: string
  street: string
  street2: string
  city: string
  provence?: string
  postalCode: string
  defaultBilling: boolean
  defaultShipping: boolean
}

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
  userAddresses: Array<IAddress>
  phoneNumber: string
  media?: Array<string>
  role?: string
  active?: boolean
  verified?: boolean
  accountNumber?: string
  signupDate?: Date
  passwordChangeDate?: Date
}

export interface IAuthUser extends Pick<IUser, 'name' | 'email'> {
  userId?: string
  insertedId?: string
  token?: string
  isAuthenticated?: boolean
}

export interface IEligibility {
  name: string
  slug: string
}

export interface INextHigherAssembly {
  name: string
  slug: string
  partNumber: string
}

export interface IMedia {
  name: string
  slug: string
}

export interface IProduct {
  _id?: string
  sku: string
  acsPartNumber: string
  // name: string
  tbq: boolean
  slug: string
  price: number
  salePrice?: number
  qtySold?: number
  media: Array<IMedia>
  oem: string
  oemPartNumber: string
  eligibilities?: Array<string>
  nextHigherAssemblies?: Array<string>
  description?: string
  status: string
  // quantity: number
}

export interface ICartItem extends Pick<IProduct, '_id' | 'acsPartNumber' | 'price' | 'media' | 'tbq'> {
  quantity: number
}

export interface ICartCustomer extends Pick<IUser, 'name' | 'email' | 'phoneNumber' | 'password'> {
  _id?: string
  createAccount: boolean
}

export interface ICart {
  _id?: string
  status?: string
  items?: Array<ICartItem>
  total?: number
  customer: ICartCustomer

  // name?: string
  // email?: string
  // password?: string
  // userId?: ObjectId
  shippingAddress: Partial<IAddress>
  billingAddress: Partial<IAddress>
  phoneNumber?: string
}
