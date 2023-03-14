<script lang="ts" setup>
const props = defineProps({
  showAlert: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['proceed', 'cancel'])

const alertRef = ref()

const AlertClosed = (event: Event) => {
  //   console.log('Alert Closed', event)
  emit('cancel')
}

const AlertCancelled = (event: Event) => {
  //   console.log('Alert Cancelled', event)
  emit('cancel')
}

const closeModal = (event: Event) => {
  // console.log('Closed Alert', event)
  alertRef.value.close()
  emit('cancel')
}

const proceed = (event: Event) => {
  // console.log('Closed Alert', event)
  alertRef.value.close()
  emit('proceed')
}

watch(
  () => props.showAlert,
  (currentValue, oldValue) => {
    // console.log(currentValue)
    // console.log(oldValue)
    if (props.showAlert) alertRef.value.showModal()
  }
)
</script>

<template>
  <div class="dialog alert">
    <transition name="alert">
      <dialog ref="alertRef" @close="AlertClosed" @cancel="AlertCancelled">
        <p>'Are you sure?. This action will recreate the ptoducts database from scratch'</p>
        <button @click="proceed">Yes</button>
        <button @click="closeModal">Cancel</button>
      </dialog>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
