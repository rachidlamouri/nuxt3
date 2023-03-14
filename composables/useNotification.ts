import { useToast } from 'vue-toastification'

interface IterableValidityState extends ValidityState {
  [prop: string]: boolean
} // import ISignupData from '~/types/ISignupData'

const useNotification = () => {
  const notification = useState(
    'notification',
    () => ''
    // {
    //   return {
    //     message: '',
    //     type: 'error',
    //     duration: 0,
    //   }
    // }
  )

  const setNotification = (message: string) => {
    notification.value = message
    // {
    //   message: payload.message,
    //   type: payload.type ? payload.type : 'error',
    //   duration: payload.duration ? payload.duration : 0,
    // }
  }

  const errorMsg = useState('errorMsg', () => '')

  const setErrorMsg = (payload: string) => {
    errorMsg.value = payload
  }

  const passwordError = useState('passwordError', () => false)

  const setPasswordError = (payload: boolean) => {
    passwordError.value = payload
  }

  const signupTokenError = useState('signupTokenError', () => false)

  const setSignupTokenError = (payload: boolean) => {
    signupTokenError.value = payload
  }

  const passwordResetTokenError = useState('passwordResetTokenError', () => false)

  const setPasswordResetTokenError = (payload: boolean) => {
    passwordResetTokenError.value = payload
  }

  const formValidator = (form: HTMLFormElement) => {
    // const form = document.querySelector('form')!
    let isFormValid = true
    const allInputs: NodeListOf<HTMLInputElement | HTMLSelectElement> = form.querySelectorAll('input, select')
    // console.log(allInputs)
    // if (allInputs) {
    Array.from(allInputs).forEach((node) => {
      const plural = (node as HTMLInputElement).maxLength == 1 ? '' : 's'

      const labelElement = node.parentNode?.querySelector('label')
      // const label = labelElement

      const hintElement = node.parentNode?.querySelector('.hint')
      if (hintElement && node.type !== 'password') hintElement.innerHTML = ''
      // console.log(node.validity)
      // if (node.validity) {
      const iterableValidityNode = node.validity as IterableValidityState

      for (const prop in iterableValidityNode) {
        // console.log(node.type, prop, iterableValidityNode[prop])

        if (prop === 'valid' || !iterableValidityNode[prop]) continue
        isFormValid = false
        node.classList.add('checked')

        if (!hintElement || node.type === 'password') continue
        switch (prop) {
          // case 'valid':
          //   console.log('PPPPPP', prop, iterableValidityNode[prop])
          //   if (iterableValidityNode[prop]) isFormValid = true
          //   break
          case 'valueMissing':
            hintElement.innerHTML = labelElement ? `${labelElement.innerHTML} is required` : `This field is required`
            break

          case 'patternMismatch':
            hintElement.innerHTML = labelElement
              ? `Please enter a valid ${labelElement.innerHTML}`
              : `This field does not match the required pattern`
            break

          case 'tooShort':
            hintElement.innerHTML = `${(node as HTMLInputElement).maxLength} character${plural} minimum`
            break

          case 'tooLong':
            hintElement.innerHTML = `${(node as HTMLInputElement).maxLength} character${plural} maximum`
            break

          case 'rangeUnderflow':
            hintElement.innerHTML = `Please enter a number greater than ${(node as HTMLInputElement).min}`
            break

          case 'rangeOverflow':
            hintElement.innerHTML = `Please enter a number less than ${(node as HTMLInputElement).max}`
            break

          default:
            break
        }
      }
      // }
      // }
      // console.log((node as HTMLInputElement).parentNode?.querySelector('.hint'))
    })
    return isFormValid
  }

  return {
    notification,
    setNotification,
    errorMsg,
    setErrorMsg,
    passwordError,
    setPasswordError,
    signupTokenError,
    setSignupTokenError,
    passwordResetTokenError,
    setPasswordResetTokenError,
    formValidator,
  }
}
export default useNotification
