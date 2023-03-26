<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: '',
  },
  label: {
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
  <div class="input checkbox">
    <input
      class=""
      type="checkbox"
      v-bind="$attrs"
      :checked="props.modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label :v-for="$attrs.id" v-if="label">{{ label }}</label>
  </div>
</template>

<style lang="scss" scoped>
// .input {
//   display: flex;
//   align-items: center;
//   gap: var(--space-2xs);

//   label {
//     order: 1;
//     display: block;
//   }

//   input {
//     border: 1px solid coral;
//     width: 1.2rem;
//     height: 1.2rem;
//     display: block;
//   }
// }
</style>
