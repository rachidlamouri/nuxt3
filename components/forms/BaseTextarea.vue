<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
defineEmits(['update:modelValue'])

// const fieldType = ref(props.type)
</script>

<template>
  <label class="">
    <span class="label"> {{ label }}</span>
    <div class="inner">
      <textarea
        class="input"
        :type="$attrs.type"
        :readonly="$attrs.readonly"
        :disabled="$attrs.disabled"
        placeholder=""
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        >{{ modelValue }}</textarea
      >
    </div>
  </label>
</template>

<style scoped></style>
