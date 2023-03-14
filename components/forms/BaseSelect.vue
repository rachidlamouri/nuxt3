<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  selectOptions: {
    type: Array as PropType<
      Array<{
        value: string
        text: string | number
      }>
    >,
    required: true,
  },

  nullOption: {
    type: String,
    defualt: 'Select Option',
  },
  hint: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="select">
    <label :v-for="$attrs.id" v-if="label">{{ label }} </label>
    <select v-bind="$attrs" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
      <option value="">{{ nullOption }}</option>
      <option
        v-for="selectOption in selectOptions"
        :value="selectOption.value"
        :selected="selectOption.value === modelValue"
      >
        {{ selectOption.text }}
      </option>
    </select>
    <div class="hint">{{ hint }}</div>
  </div>
</template>

<style lang="scss" scoped>
select {
  appearance: none;
  position: relative;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 50%;
  background-size: 2rem;
  cursor: pointer;
}
</style>
