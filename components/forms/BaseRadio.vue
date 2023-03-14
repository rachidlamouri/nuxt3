<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
// const attrs = useAttrs()

// const handleChange = (event:any) => {
//   emit('update:modelValue', event.target.value)
// }
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label class="input">
    <input type="radio" :checked="modelValue === value" :value="value" @change="$emit('update:modelValue', $event)" />
    <span class="">{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/variables';

// .base-radio {
//   // border: 1px solid red;
//   // background-color: teal;
//   margin: 0 auto;
//   display: inline-flex;
//   // max-width: fit-content;
//   align-items: center;
//   gap: 0.8rem;

//   input {
//     cursor: pointer;
//     width: 1.5rem;
//     height: 1.5rem;
//   }
// }
</style>
