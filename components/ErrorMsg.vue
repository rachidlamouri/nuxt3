<script lang="ts" setup>
// defineEmits(['getNewSignupToken', 'resetPassword', 'getNewPasswordResetToken', 'login'])
const { appErrorMsg } = useErrorStore()
</script>

<template>
  <div>
    <div class="error-msg" v-show="appErrorMsg">
      <p>{{ appErrorMsg }}</p>
      <!-- <slot name="action"></slot> -->
      <!--  <div class="" v-if="passwordError">
        <div>
          <span>Click here to login </span>
          <button class="btn btn-accent btn-accent-text" @click="$emit('login')">Login</button>
        </div>
        <div>
          <span>Forgot your password? click here to reset it </span>
          <button class="btn btn-accent btn-accent-text" @click="$emit('resetPassword')">Reset password</button>
        </div>
      </div>
      <div class="" v-if="signupTokenError">
        <span>Click here to get a</span>
        <button class="btn btn-accent btn-accent-text" @click="$emit('getNewSignupToken')">new signup token</button>
      </div>
      <div class="" v-if="passwordResetTokenError">
        <span>Click here to get a</span>
        <button class="btn btn-accent btn-accent-text" @click="$emit('getNewPasswordResetToken')">
          new password reset token
        </button>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scopped></style>
