<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  label: {
    type: String,
    default: '',
  },
  radioGroupOptions: {
    type: Array,
    required: false,
  },
  orientation: {
    type: String,
    default: 'verical',
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
  <fieldset class="input radio-group" :class="orientation">
    <legend>
      {{ label }}
    </legend>
    <div class="list">
      <label v-for="(radioGroupOption, index) in radioGroupOptions" :key="index" :index="index">
        <input
          type="radio"
          :checked="modelValue === radioGroupOption.value"
          :value="radioGroupOption.value"
          :modelValue="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <span class="">{{ radioGroupOption.text }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style lang="scss" scoped></style>
