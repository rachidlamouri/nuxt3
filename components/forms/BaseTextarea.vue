<script setup lang="ts">
const props = defineProps({
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
defineEmits(['update:modelValue'])
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input textarea">
    <label :v-for="$attrs.id" v-if="label">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p class="hint">{{ hint }}</p>
  </div>
</template>

<style scoped></style>
