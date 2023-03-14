<script lang="ts" setup>
import { string } from 'zod'
import { IUser, ICountry, IProvence, ICart } from '~/utils/types'

const emit = defineEmits(['closeAddressModal', 'cartAddressUpdated', 'saveAddress'])

const { cart } = useCartStore()
const createAccount = ref(false)
const formInputs = reactive({
  email: cart.value.customer.email,
  password: 'Foo1234#',
  phoneNumber: '555-555-5555',
  createAccount: false,
  userAddress: {
    addressType: 'residential',
    salutation: 'Mr.',
    name: cart.value.customer.name,
    company: 'YRL Consulting, LLC',
    country: 'Armenia',
    street: '11 Alpha Park',
    street2: 'Suite 11',
    city: 'Highland Heights',
    provence: 'Arizona',
    postalCode: '44143',
  },
})

// const newCustomerFormInputs = ref()

onMounted(() => {})

const { data: countries, error: countriesError } = await useFetch('/api/v1/countries')
const { data: provences, error: provencesError } = await useFetch('/api/v1/provences')

const saveAddress = () => {
  // const newCustomer = {
  //   name: newCustomerFormInputs.value.name,
  //   email: newCustomerFormInputs.value.email,
  //   password: newCustomerFormInputs.value.password,
  //   userAddresses: [{ ...newCustomerFormInputs.value.userAddress, name: newCustomerFormInputs.value.name }],
  //   phoneNumbers: [{ ...newCustomerFormInputs.value.phoneNumber }],
  // }
  // newCustomer.userAddresses[0].country = countries.value.find(
  //   (c: ICountry) => c._id === newCustomer.userAddresses[0].country
  // )

  // newCustomer.userAddresses[0].provence = provences.value.find(
  //   (p: IProvence) => p._id === newCustomer.userAddresses[0].provence
  // )

  // newCustomer.phoneNumbers[0].phoneCountry = countries.value.find(
  //   (c: ICountry) => c._id === newCustomer.phoneNumbers[0].phoneCountry
  // )
  // if (!formValidator(document.querySelector('form')!)) return setErrorMsg('Please corect the errors below.')
  // if (createAccount.value && !localUser.value.password) return setErrorMsg('Password is required.')
  // const country = countries.value.find((c: ICountry) => c._id == localUser.value.userAddress.country._id)
  // if (country) localUser.value.userAddress.country = country
  // const provence = provences.value.find((p: IProvence) => (p._id = localUser.value.userAddress.provence._id))
  // if (provence) localUser.value.userAddress.provence = provence
  // const phoneCountry = countries.value.find((c: ICountry) => c._id == localUser.value.phoneNumber.phoneCountry._id)
  // if (phoneCountry) localUser.value.phoneNumber.phoneCountry = phoneCountry

  // localUser.value.userAddress.name = localUser.value.name
  // localUser.value.userAddress.name = localUser.value.name

  emit('saveAddress', { formInputs })
}
</script>

<template>
  <div class="">
    <!-- <ClientOnly> -->
    <form class="flow-s" @submit.prevent="saveAddress" novalidate>
      <ErrorMsg />
      <p>Mandatory fields are marked with a *</p>
      <!-- <input class="" type="hidden" v-model="n._id" /> -->
      <FormsRadioGroup
        orientation="horizontal"
        id="addressType"
        label="My delivery address is"
        v-model="formInputs.userAddress.addressType"
        :radioGroupOptions="[
          { value: 'commercial', text: 'Commercial' },
          { value: 'residential', text: 'Residential' },
        ]"
      />
      <FormsBaseSelect
        label="Title"
        id="title"
        v-model="formInputs.userAddress.salutation"
        :selectOptions="[
          { value: 'Mr/Ms.', text: 'Mr/Ms.' },
          { value: 'Ms.', text: 'Ms.' },
          { value: 'Mr.', text: 'Mr.' },
          { value: 'Dr.', text: 'Dr.' },
          { value: 'Mrs.', text: 'Mrs.' },
        ]"
        nullOption="-"
      />
      <FormsBaseInput
        type="text"
        id="name"
        label="Name"
        placeholder="Name"
        required
        v-model="formInputs.userAddress.name"
      />
      <FormsBaseInput
        type="text"
        id="company"
        label="Company"
        placeholder="Company"
        v-model="formInputs.userAddress.company"
      />
      <FormsBaseSelect
        label="Country"
        id="country"
        required
        v-model="formInputs.userAddress.country"
        :selectOptions="countries.map((c) => ({ value: c.countryName, text: c.countryName }))"
        nullOption="Choose country"
        v-if="countries"
      />
      <div class="flow-2xs">
        <FormsBaseInput
          type="text"
          id="street"
          label="Street Address"
          placeholder="Appartment, suite, unit, etc. (optional)"
          required
          v-model="formInputs.userAddress.street"
        />
        <FormsBaseInput
          type="text"
          id="street2"
          label=" "
          placeholder="Appartment, suite, unit, etc. (optional)"
          v-model="formInputs.userAddress.street2"
        />
      </div>

      <FormsBaseInput
        type="text"
        id="city"
        label="Town / City"
        placeholder=""
        required
        v-model="formInputs.userAddress.city"
      />
      <FormsBaseSelect
        label="State"
        id="provence"
        required
        v-model="formInputs.userAddress.provence"
        :selectOptions="provences.map((p) => ({ value: p.name, text: p.name }))"
        nullOption="Choose state"
        v-if="provences"
      />
      <FormsBaseInput
        type="text"
        id="postalCode"
        label="ZIP Code"
        placeholder=""
        required
        v-model="formInputs.userAddress.postalCode"
      />
      <FormsBaseInput
        type="email"
        id="email"
        label="Email"
        placeholder=""
        required
        v-model="formInputs.email"
        v-if="!Object.values(cart.customer)"
      />
      <FormsBaseInput
        type="text"
        id="phoneNumber"
        label="Phone Number"
        placeholder=""
        required
        v-model="formInputs.phoneNumber"
      />
      <FormsBaseCheckbox
        type="checkbox"
        id="createAccount"
        label="Create an account"
        v-model="createAccount"
        v-if="!Object.values(cart.customer)"
      />
      <transition name="password">
        <FormsPasswordInput
          type="password"
          id="password"
          required
          v-model="formInputs.password"
          label="Password"
          :showHint="true"
          v-if="createAccount && !Object.values(cart.customer)"
        />
      </transition>
      <button class="btn btn-primary" id="submit" ref="buttonRef">Save address</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.password-enter-active,
.password-leave-active {
  transition: all 500ms ease-in-out;
}

.password-enter-from,
.password-leave-to {
  opacity: 0;
  transform: translatey(-3rem);
}

.password-enter-to,
.password-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
