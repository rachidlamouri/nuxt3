<script lang="ts" setup>
import { emailPattern } from '~/utils/patterns'

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },

  hint: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const setValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input">
    <label :v-for="$attrs.id" v-if="label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :pattern="emailPattern"
      :value="modelValue"
      @input="setValue"
      v-if="$attrs.type === 'email'"
    />
    <input v-bind="$attrs" :value="modelValue" @input="setValue" v-else />
    <p class="hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
