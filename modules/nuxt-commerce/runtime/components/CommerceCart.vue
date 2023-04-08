<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { IProduct, ICartItem } from '~/utils/schema'

const emit = defineEmits(['closeCartModal'])

const { cart, cartTotal, updateCart, saveCart, removeItem } = useCartStore()
const addingToCart = ref()
const removedItems = ref<Array<ICartItem>>([])
const config = useRuntimeConfig()

const updateCartItems = async (payload: { item: ICartItem; action: string }) => {
  console.log(payload)
  addingToCart.value = true
  updateCart(payload.item, payload.action)
  if (await saveCart()) useToast().success(`Cart updated`)
  addingToCart.value = false
}

const removeItemFromCart = async (item: ICartItem) => {
  addingToCart.value = true
  removeItem(item)
  if (await saveCart()) useToast().success(`${item.acsPartNumber} removed from your cart`)
  addingToCart.value = false
  removedItems.value.push(item)
}

const undoRemoveItemFromCart = async (item: ICartItem) => {
  console.log(item)
  cart.value.items.push(item)
  const index = removedItems.value.findIndex((it) => it._id === item._id)
  if (index !== -1) removedItems.value.splice(index, 1)
}

const checkout = async () => {
  emit('closeCartModal')
  return navigateTo({ path: '/checkout' })
}

const shopNow = () => {
  emit('closeCartModal')
  navigateTo({ path: '/products' })
}
</script>

<template>
  <div class="cart | h-full">
    <div class="cart__header">
      <p class="">Shopping Bag</p>
      <button class="btn" @click="$emit('closeCartModal')">
        <Icon class="" name="mdi:close" />
        <span class="visually-hidden">Close cart</span>
      </button>
    </div>
    <div class="cart__main | flow-s" v-if="cart.items.length || removedItems.length == 1">
      <p class="center mt-xs">Free part sample with all orders. Add at checkout</p>
      <div class="items">
        <div class="cart-items | flow-s">
          <ul class="" role="list" v-if="removedItems">
            <li class="flex justify-between items-center" v-for="item in removedItems" :index="item._id">
              <div class="flex gap-s">
                <p>{{ item.acsPartNumber }} removed from your cart</p>
                <button class="btn btn-accent btn-accent-text" @click="undoRemoveItemFromCart(item)">Undo?</button>
              </div>
            </li>
          </ul>

          <ul class="" role="list">
            <li class="flex justify-between items-center" v-for="item in cart.items" :index="item._id">
              <div class="flex items-center gap-s">
                <div class="image">
                  <img
                    class="w-8"
                    :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/products/${item.media[0].name}.jpg`"
                    :alt="`ACS ${item.media[0].name} Product Image`"
                    v-if="item.media && item.media.length"
                  />
                  <img class="w-8" src="/images/placeholder.png" alt="Image Placeholder" v-else />
                </div>
                <div class="tracking-3">
                  <p class="font-bold">{{ item.acsPartNumber }}</p>
                  <ProductsPrice :product="item" />
                </div>
              </div>
              <div class="flex items-center gap-xs">
                <div class="flex items-center">
                  <button
                    class="w-7 h-6 p-0 border border-neutral-80 text-1 cursor-pointer"
                    @click="updateCartItems({ item, action: 'dec' })"
                  >
                    -
                  </button>
                  <input class="w-7 h-6 border-y border-neutral-80 text-center" type="text" :value="item.quantity" />
                  <button
                    class="w-7 h-6 p-0 border border-neutral-80 text-1 cursor-pointer"
                    @click="updateCartItems({ item, action: 'inc' })"
                  >
                    +
                  </button>
                </div>
                <Spinner class="spinner" v-if="addingToCart" />
                <button class="cursor-pointer bg-neutral-90 p-3xs br-full center">
                  <span class="material-symbols-outlined text--1" aria-hidden="true" @click="removeItemFromCart(item)">
                    <Icon class="" name="mdi:trash-can-outline" />
                  </span>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="flow-2xs">
          <div class="cart-total | flex flex-col gap-xs font-bold tracking-3 mt-l">
            <div class="flex justify-between items-center">
              <p class="uppercase">Total</p>
              <p class="text-accent-60">${{ (cartTotal() / 100).toFixed(2) }}</p>
            </div>
          </div>
          <p>Shipping costs and special offers not included</p>
          <button class="btn btn-primary cart" @click="checkout">Ckeckout</button>
        </div>
      </div>
    </div>
    <div class="cart-empty | flow-2xs p-s" v-else>
      <p class="text-center">You have no items in your shopping bag</p>
      <button class="btn btn-primary cart" @click="shopNow">Shop</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    background-color: var(--color-neutral-90);
    padding: var(--space-2xs);
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-2xs);

    .items {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  .spinner {
    width: 1.4rem;
    height: 1.4rem;
  }
}
</style>
