// import {string } from 'mongodb'

import { IProduct, ICart, ICartItem } from '~/utils/schema'

export const useCartStore = () => {
  // const { errorMsg, message } = useAppState()
  const config = useRuntimeConfig()

  const cart = useState('cart', (): ICart | unknown => ({
    // items: [],
    // customer: {},
    // billingAddress: {},
    // shippingAddress: {},
    // total: 0,
    // status: 'cart',
  }))

  // const updateLocalStorage = () => {
  //   if (process.client) {
  //     // console.log('GGGGGGGGGG')
  //     localStorage.setItem('cart', JSON.stringify(cart.value))
  //   }
  // }

  const saveCart = async () => {
    const { data, error } = await useFetch('/api/v1/orders', {
      baseURL: config.apiUrl,
      method: 'POST',
      body: cart.value,
    })
    console.log('USECART', data.value)
    if (error.value) {
      console.log(error.value)
      return false
    }
    // if (!data.value) throw createError('No data from saveCart')

    const cartId = useCookie('cartId', { maxAge: 1 * 60 * 60 })
    cartId.value = data.value as string
    return true
  }

  const loadCart = () => {
    const cookies = useCookie('cartId')
    // console.log('XXXXXXX', cookies.value)
  }

  const populateItem = (item: IProduct) => {
    return {
      _id: item._id,
      acsPartNumber: item.acsPartNumber,
      // name: item.acsPartNumber,
      price: item.price,
      media: item.media,
      tbq: item.tbq,
    }
  }

  const addRemoveItem = (item: IProduct, action: string) => {
    // console.log('Item', item)
    const cartItem = {
      ...populateItem(item),
    }

    if (!cart.value || (cart.value &&  ||!('items' in cart.value))) {
      cart.value = {
        items: [{ ...cartItem, quantity: 1 }],
        // if(!cart.value.hasOwnProperty('items')) {
        // cart.value.items =
      }
      // Object.defineProperty(cart.value, 'items', {
      //   value: [{ ...cartItem, quantity: 1 }],
      //   // enumerable: true,
      // })
      // cart.value.items=[{ ...cartItem, quantity: 1 }]
    } else {
      const index = cart.value.items.findIndex((it: ICartItem) => it._id == item._id)
      if (index !== -1) {
        if (action === 'inc') {
          // if (cart.value && cart.value.items && cart.value.items.length && cart.value.items[index].quantity)
          cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + 1
        }
        if (action === 'dec') {
          if ((cart.value.items[index].quantity as number) > 1) {
            cart.value.items[index].quantity = (cart.value.items[index].quantity as number) - 1
          } else {
            cart.value.items.splice(index, 1)
          }
        }
      } else {
        if (action === 'inc') {
          cart.value.items.push({ ...cartItem, quantity: 1 })
        }
      }
    }
    cart.value.total = cartTotal()
    return saveCart()
    // updateLocalStorage()
  }

  const addToCart = async (item: IProduct, quantity: number = 1) => {
    console.log('CCCCCart')
    if (isNaN(quantity) || quantity === null) return
    const cartItem = {
      ...populateItem(item),
      quantity: +quantity,
    }
    if (!cart.value.items) {
      cart.value.items = []
      cart.value.items.push(cartItem)
    } else {
      const index = cart.value.items.findIndex((it: ICartItem) => it._id == item._id)
      if (index !== -1) {
        if (quantity) cart.value.items[index].quantity += quantity
        else cart.value.items.splice(index, 1)
      } else {
        cart.value.items.push(cartItem)
      }
    }
    cart.value.total = cartTotal()
  }

  const updateCart = (item: ICartItem, action: string) => {
    // console.log('Item', item)
    const cartItem = {
      ...populateItem(item),
    }
    if (!cart.value.items) {
      cart.value.items = []
      cart.value.items.push({ ...cartItem, quantity: 1 })
    } else {
      const index = cart.value.items.findIndex((it: ICartItem) => it._id == item._id)
      if (index !== -1) {
        if (action === 'inc') {
          // if (cart.value && cart.value.items && cart.value.items.length && cart.value.items[index].quantity)
          cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + 1
        }
        if (action === 'dec') {
          if ((cart.value.items[index].quantity as number) > 1) {
            cart.value.items[index].quantity = (cart.value.items[index].quantity as number) - 1
          } else {
            cart.value.items.splice(index, 1)
          }
        }
      } else {
        if (action === 'inc') {
          cart.value.items.push({ ...cartItem, quantity: 1 })
        }
      }
    }
    cart.value.total = cartTotal()

    // updateLocalStorage()
  }

  const removeItem = (item: ICartItem) => {
    // console.log('CART ITEM', cartItem)
    if (cart.value.items && cart.value.items.length) {
      const index = cart.value.items.findIndex((it: ICartItem) => it._id == item._id)
      if (index !== -1) cart.value.items.splice(index, 1)
      cart.value.total = cartTotal()
      // updateLocalStorage()
    }
  }

  const numberOfItems = () => {
    return cart.value.items && cart.value.items.length
      ? cart.value.items.reduce((accumulator: number, item: ICartItem) => accumulator + item.quantity, 0)
      : 0
  }

  const cartTotal = () => {
    return cart.value.items && cart.value.items.length
      ? cart.value.items.reduce((accumulator: number, item: ICartItem) => accumulator + item.price * item.quantity, 0)
      : 0
  }

  // const cartTotal = () => {
  //   if (cart.value.items && cart.value.items.length)
  //     return cart.value.items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0)
  // }

  const fetchPublishableKey = async () => {
    // errorMsg.value = ''
    // message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/publishableKey`)
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // return data.value.publishableKey
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        // errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  const fetchClientSecret = async (orderId: string) => {
    // errorMsg.value = ''
    // message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/secret`, {
      //   method: 'POST',
      //   body: { orderId },
      // })
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // console.log('PI', data.value)
      // return data.value.clientSecret
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        // errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  return {
    cart,
    addRemoveItem,
    addToCart,
    updateCart,
    removeItem,
    numberOfItems,
    // updateItemQuantity,
    // storeCartCustomer,
    // updateShippinAddress,
    // updateCustomerEmail,
    cartTotal,
    fetchPublishableKey,
    fetchClientSecret,
    saveCart,
    // updateLocalStorage,

    loadCart,
  }
}

// export default useCartStore
