<script lang="ts" setup>
import { passwordPattern } from '~/utils/patterns'

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
    type: Boolean,
    default: false,
  },

  action: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const fieldType = ref('password')
const capsLocked = ref()
const passwordStrengthMeterRef = ref()
// const inputRef = ref()
const password = ref(props.modelValue)

const passwordStrengthMeter = computed(() => {
  const deductions = hints.value.reduce((accumulator, item) => accumulator + item.deduction, 0)
  return 100 - deductions
})

const hints = ref([
  { hintType: 'pwLength', message: '8 characters or more', passFail: 'fail', deduction: 0 },
  { hintType: 'pwLowerCase', message: '1 lowercase character or more', pass: true, deduction: 0 },
  { hintType: 'pwUpperCase', message: '1 uppercase character or more', pass: true, deduction: 0 },
  { hintType: 'pwSpecialChar', message: '1 special character or more', pass: true, deduction: 0 },
  { hintType: 'pwNumber', message: '1 number or more', pass: true, deduction: 0 },
  { hintType: 'pwRepeatChar', message: 'No repeating cahracters', pass: true, deduction: 0 },
])

const setLengthStrength = () => {
  const index = hints.value.findIndex((h) => h.hintType === 'pwLength')
  if (index !== -1) {
    if ((password.value as string).length < 8) {
      hints.value[index].message = 'Your password is too short'
      hints.value[index].deduction = 40
      hints.value[index].passFail = 'fail'
    } else if ((password.value as string).length < 10) {
      hints.value[index].message = 'Your password could be longer'
      hints.value[index].deduction = 15
      hints.value[index].passFail = 'pass'
    } else {
      hints.value[index].message = 'You password is long enough'
      hints.value[index].deduction = 0
      hints.value[index].passFail = 'pass'
    }
  }
}

const setRegexStrength = (hintType: string, regex: any) => {
  const index = hints.value.findIndex((h) => h.hintType === hintType)
  const matches = (password.value as string).match(regex) || []
  if (index !== -1) {
    const text =
      hintType === 'pwLowerCase'
        ? 'lowercase'
        : hintType === 'pwUpperCase'
        ? 'uppercase'
        : hintType === 'pwSpecialChar'
        ? 'special'
        : 'numer'

    if (matches.length === 0) {
      hints.value[index].message = `Your password has no ${text} characters`
      hints.value[index].deduction = 20
      hints.value[index].passFail = 'fail'
    } else if (matches.length <= 2) {
      hints.value[index].message = `Your password could use more  ${text} characters`
      hints.value[index].deduction = 5
      hints.value[index].passFail = 'pass'
    } else {
      hints.value[index].message = `Your password has enough  ${text} characters`
      hints.value[index].deduction = 0
      hints.value[index].passFail = 'pass'
    }
  }
}

const setRepeatStrength = () => {
  const index = hints.value.findIndex((h) => h.hintType === 'pwRepeatChar')
  const matches = (password.value as string).match(/(.)\1/g) || []
  if (index !== -1) {
    if (matches.length > 0) {
      hints.value[index].message = `Your password ${matches.length} repeat charcaters`
      if (matches.length < 3) hints.value[index].deduction = matches.length * 10
      hints.value[index].passFail = 'fail'
    } else {
      hints.value[index].message = `Your password has no repeat characters`
      hints.value[index].deduction = 0
      hints.value[index].passFail = 'pass'
    }
  }
}

const updateHint = () => {
  if (!passwordStrengthMeterRef.value) return
  setLengthStrength()
  setRegexStrength('pwLowerCase', /[a-z]/g)
  setRegexStrength('pwUpperCase', /[A-Z]/g)
  setRegexStrength('pwNumber', /[0-9]/g)
  setRegexStrength('pwSpecialChar', /[^a-zA-Z0-9\s]/g)
  setRepeatStrength()
  passwordStrengthMeterRef.value.style.setProperty('--password-strength', passwordStrengthMeter.value)
}

const handleInput = (event: Event) => {
  password.value = (event.target as HTMLInputElement).value
  updateHint()
  emit('update:modelValue', password.value)
}

onMounted(() => {
  if (password.value) updateHint()
})
</script>

<template>
  <div class="input">
    <label :v-for="$attrs.id"> {{ label }}</label>
    <input
      class="input"
      v-bind="$attrs"
      :pattern="passwordPattern"
      :type="fieldType"
      :value="modelValue"
      @input="handleInput"
      @keyup="capsLocked = $event.getModifierState && $event.getModifierState('CapsLock')"
      aria-labelledby="password"
      ref="inputRef"
      autocomplete="off"
      data-pasword="password"
    />

    <p class="hint" v-if="action === 'signup'">
      Password must be
      <span :class="{ fail: hints[0].passFail === 'fail', pass: hints[0].passFail === 'pass' }">8 charcters</span> or
      more and conatins at least 1 number, 1 digit, 1 uppercase, 1 lowercase and 1 special character.
    </p>
    <div class="strength" v-if="action === 'signup'">
      <!-- <ul role="list">
        <li class="" :class="{ fail: hint.passFail === 'fail', pass: hint.passFail === 'pass' }" v-for="hint in hints">
          {{ hint.message }}
        </li>
      </ul> -->

      <div
        class="strength-meter"
        :class="{
          danger: passwordStrengthMeter < 30,
          warning: passwordStrengthMeter >= 30 && passwordStrengthMeter <= 60,
          success: passwordStrengthMeter > 60,
        }"
        ref="passwordStrengthMeterRef"
      >
        <p v-if="passwordStrengthMeter > 60">Passowrord strong</p>
        <p v-if="passwordStrengthMeter >= 30 && passwordStrengthMeter <= 60">Passowrord OK</p>
        <p v-if="passwordStrengthMeter < 30">Passowrord weak</p>
      </div>
    </div>
    <div class="icon">
      <button class="btn" @click.prevent="fieldType = fieldType === 'text' ? 'password' : 'text'">
        <Icon class="" name="mdi:eye-outline" v-if="fieldType === 'password'" />
        <Icon class="" name="mdi:eye-off-outline" v-if="fieldType === 'text'" />
        <Icon class="" name="mdi:keyboard-caps" v-if="capsLocked" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input {
  position: relative;

  span {
    &.fail {
      color: red;
    }

    &.pass {
      color: green;
    }
  }

  .strength {
    margin-block-start: 1rem;
    ul li {
      margin-block-start: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &::before {
        content: '';
        display: inline-block;
        width: 1.2rem;
        height: 1.22rem;
        border: 2px solid var(--color-neutral-50);
        border-radius: 100%;
        color: var(--color-primary-99);
        display: grid;
        place-items: center;
        font-size: 80%;
      }

      &.fail {
        &::before {
          // background-color: var(--color-error-60);
        }
      }

      &.pass {
        &::before {
          content: '\2713';
          background-color: var(--color-success-80);
        }
      }
    }
    .strength-meter {
      margin-block-start: 1rem;
      --password-strength: 0;
      --bg-color: transparent;
      width: 100%;
      height: 2rem;
      border: 2px solid grey;
      border-radius: 1rem;
      overflow: hidden;
      position: relative;
      p {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        height: 100%;
        // background-color: magenta;
        width: calc(1% * var(--password-strength, 0));
        // width: 20%;
        // border: 2px solid red;
        display: inline-block;
        transition: 500ms ease;
      }

      &.danger {
        &::before {
          background-color: var(--color-error-60);
        }
      }

      &.warning {
        &::before {
          background-color: var(--color-accent-70);
        }
      }

      &.success {
        &::before {
          background-color: var(--color-success-80);
        }
      }
    }
  }

  .icon {
    position: absolute;
    top: var(--space-m);
    right: 0;

    // margin-inline-end: var(--space-3xs);
  }
}
</style>
