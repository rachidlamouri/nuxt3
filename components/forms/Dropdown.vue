<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  // name: {
  //   type: String,
  //   default: '',
  // },
  // placeholder: {
  //   type: String,
  //   default: '',
  // },
  options: {
    type: Array,
    required: true,
  },
})
defineEmits(['update:modelValue'])

const filteredOptions = computed(() => {
  // if (process.client && document.activeElement == countriesRef.value) {
  //   console.log('Y')

  if (!props.modelValue) return props.options
  else
    return props.options.filter(
      (c: any) => c.toLowerCase().includes(props.modelValue.toLowerCase())
      // c.countryName.toUpperCase().includes(shippingAddress.value.country)
    )
  // } else {
  //   console.log('Y')
  //   return []
  // }
})

// const filteredOptions = computed(() =>
//   props.options.filter(
//     (c: any) =>
//       c.countryName.toLowerCase().includes(shippingAddress.value.provence) ||
//       c.countryName.toUpperCase().includes(shippingAddress.value.provence)
//   )
// )
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input dropdown">
    <label class="" for="">{{ label }}</label>
    <input
      class="input"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      autocomplete="off"
    />
    <ul class="" role="list">
      <li class="" v-for="option in filteredOptions" :index="option" @click="$emit('update:modelValue', option)">
        <button>
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
// ul {
//   top: 110% !important;
//   // display: none;
//   opacity: 0;
//   // visibility: hidden;
// }

// input {
//   // border: 1px solid red;
//   &:focus + ul {
//     // display: block;
//     opacity: 1;
//     // visibility: visible;
//   }
// }
</style>
