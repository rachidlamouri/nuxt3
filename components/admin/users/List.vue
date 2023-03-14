<script setup lang="ts">
import { type PropType } from 'vue'
import { IUser } from '~/utils/types'

const props = defineProps({
  users: {
    type: Array as PropType<Array<IUser>>,
    required: true,
  },
})
</script>

<template>
  <div class="users-list">
    <ul class="gap-s" role="list">
      <AdminUsersCard :user="user" v-for="user in users" :key="user.name" />
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
