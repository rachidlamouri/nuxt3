<script setup lang="ts">
import { type PropType } from 'vue'
import { IUser } from '~/utils/types'
const props = defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true,
  },
})

const { updateCart } = useCart1()
</script>

<template>
  <li class="shadow-md">
    <div class="flex justify-between px-xs">
      <p class="text-0 font-bold text-primary-10">{{ user.email }}</p>
      <p class="text-0 font-bold text-primary-10">{{ user.name }}</p>
      <p class="text-0 font-bold text-primary-10">{{ user.verified }}</p>
      <p class="text-0 font-bold text-primary-10">{{ user.active }}</p>
      <!-- <p class="text--1" v-if="user.price != 10000">${{ user.price.toFixed(2) }}</p>
      <p class="text--2" v-else>Request Quote</p> -->
    </div>
    <!-- <div class="image">
      <img
        :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/users/${user.media[0].name}.jpg`"
        :alt="`ACS ${user.media[0].name} user Image`"
        v-if="user.media && user.media.length"
      />
      <img src="/images/placeholder.png" alt="Image Placeholder" v-else />
    </div> -->
    <!-- <div class="flex justify-between px-xs">
      <button class="btn btn-user" @click="updateCart(user, 1)">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="flex-1">Add To Cart</span>
      </button>
      <NuxtLink class="btn btn-user" :to="{ name: 'users-slug', params: { slug: user.slug } }">
        <span class="material-symbols-outlined">list</span>
        <span class="">Details</span>
      </NuxtLink>
    </div> -->
  </li>
</template>

<style lang="scss" scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
