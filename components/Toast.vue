<script lang="ts" setup>
import { text } from 'stream/consumers'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})

// const emit = defineEmits(['hideSnackbar'])
// const { setNotification, notification } = useNotification()
// const toastModalRef = ref()
// const closetoastModal = (event) => {
//   toastModalRef.value.close()
// }

// const toastModalClosed = (event) => {
//   // console.log(event)
// }

// const toastModalCancelled = (event) => {
//   // console.log(event)
// }

// const timeout = ref()

// watch(
//   props.message,
//   async (currentVal, oldValue) => {
//     console.log('OOOOO', oldValue)
//     console.log(currentVal)
//     clearTimeout(timeout.value)
//     // if (props.duration != 0) {
//     // if (props.show) {
//     timeout.value = setTimeout(() => {
//       emit('hideSnackbar')
//     }, 3000)
//     // }
//     // }
//   }
//   // { deep: true }
// )
</script>

<template>
  <div class="toast">
    <!-- <div v-if="notification.message"> -->
    <!-- <ClientOnly> -->

    <!-- <Teleport to="body"> -->
    <div ref="toastModalRef">
      <div class="flex items-center gap-s">
        <div>
          <span class="material-symbols-outlined" aria-hidden="true">search</span>
        </div>
        <div>
          <p>Toast Title</p>
          <p>{{ message }}</p>
        </div>
        <!-- <div>
            <button @click="closetoastModal">Close Teaos</button>
          </div> -->
      </div>

      <!-- <SearchResults @toastModalClosed="closeToastModal" /> -->
    </div>
    <!-- </Teleport> -->
    <!-- </ClientOnly> -->
    <!-- </transition> -->
  </div>
  <!-- </div> -->
</template>
<style lang="scss" scoped>
.toast {
  color: var(--color-primary-10);
  padding: var(--space-xs);
  position: fixed;
  top: 8rem;
  right: 5rem;
  display: block;
  min-width: 20rem;
  border: 1px solid red;
  // :modal {
  //   margin-top: 1.3rem;

  //   margin-right: 0.6rem;
  //   width: 100vw;
  //   transform: scale(1.06);
  //   border: 1px solid red;

  //   &::backdrop {
  //     //   background-color: rgba(0 0 0 /0.8);
  //   }
  // }
}

// .toast-modal-enter-active,
// .toast-modal-leave-active {
//   transition: all 500ms ease-in-out;
// }

// .toast-modal-enter-from,
// .toast-modal-leave-to {
//   //   opacity: 0;
//   transform: translateY(-100rem);
// }

// .toast-modal-enter-to,
// .toast-modal-leave-from {
//   //   opacity: 1;
//   transform: translateY(0);
// }

// .toast-enter-active,
// .toast-leave-active {
//   transition: all 500ms ease-in-out;
// }

// .toast-enter-from,
// .toast-leave-to {
//   //   opacity: 0;
//   transform: translateY(-20rem);
// }

// .toast-enter-to,
// .toast-leave-from {
//   //   opacity: 1;
//   transform: translateY(0);
// }
</style>
