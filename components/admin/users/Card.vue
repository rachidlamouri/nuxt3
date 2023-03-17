<script setup lang="ts">
import { type PropType } from 'vue'
// import { useCartStore } from '~~/stores/useCartStorexxexx'
// import { Iuser } from '~/utils/types'
const props = defineProps({
  user: {
    type: Object as PropType<Iuser>,
    required: true,
  },
})

const { updateCart } = useCartStore()
</script>

<template>
  <li class="flex flex-col gap-xs pb-s shadow-md">
    <div class="flex justify-between px-xs">
      <h2 class="text-0 font-bold text-primary-10">{{ user.name }}</h2>
      <!-- {{ user.oem }} -->
    </div>
    <div class="image">
      <img
        class=""
        :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/users/${user.media[0].name}.jpg`"
        :alt="`ACS ${user.media[0].name} user Image`"
        v-if="user.media && user.media.length"
      />
      <img src="/images/placeholder.png" alt="Image Placeholder" v-else />
    </div>
    <div class="flex justify-between px-xs">
      <button class="btn btn-user" @click="updateCart({ ...user }, 'inc')">
        <Icon class="" name="mdi:cart-outline" />
        <span class="flex-1">Add To Cart</span>
      </button>
      <!-- <NuxtLink class="btn btn-user" :to="{ name: 'users-slug', params: { slug: user.slug } }">
        <Icon class="" name="mdi:format-list-bulleted" />
        <span class="">Details</span>
      </NuxtLink> -->
    </div>
  </li>
</template>

<style lang="scss" scoped>
// img {
//   max-width: 100%;
//   height: auto;
// }
</style>
