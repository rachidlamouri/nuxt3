import { NuxtError } from 'nuxt/app'
import { ZodIssue } from 'zod'

interface IterableValidityState extends ValidityState {
  [prop: string]: boolean
}
const useErrorStore = () => {
  const appErrorMsg = useState('appErrorMsg', () => {
    return ''
  })

  const clientFormValidator = (form: HTMLFormElement) => {
    let isFormValid = true
    const allInputs: NodeListOf<HTMLInputElement | HTMLSelectElement> = form.querySelectorAll('input, select')
    Array.from(allInputs).forEach((node) => {
      const plural = (node as HTMLInputElement).maxLength == 1 ? '' : 's'

      const labelElement = node.parentNode?.querySelector('label')
      const hintElement = node.parentNode?.querySelector('.hint')
      if (hintElement && node.dataset.pasword !== 'password') hintElement.innerHTML = ''
      const iterableValidityNode = node.validity as IterableValidityState

      for (const prop in iterableValidityNode) {
        if (prop === 'valid' || !iterableValidityNode[prop]) continue
        isFormValid = false
        node.classList.add('checked')

        if (!hintElement || node.dataset.pasword === 'password') continue
        switch (prop) {
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
    })
    return isFormValid
  }

  const resetForm = (form: HTMLFormElement) => {
    const allInputs: NodeListOf<HTMLInputElement | HTMLSelectElement> = form.querySelectorAll('input, select')
    Array.from(allInputs).forEach((node) => {
      const hintElement = node.parentNode?.querySelector('.hint')
      if (hintElement && node.dataset.pasword !== 'password') hintElement.innerHTML = ''
      node.classList.remove('fail')
    })
    return false
  }

  const parseZodError = (form: HTMLFormElement, issues: ZodIssue[]) => {
    console.log('QQQQQQQ', issues)

    if (!issues.length) return
    appErrorMsg.value = 'Please corect the errors below.'
    const allInputs: NodeListOf<HTMLInputElement | HTMLSelectElement> = form.querySelectorAll('input, select')
    Array.from(allInputs).forEach((node) => {
      const hintElement = node.parentNode?.querySelector('.hint')
      if (hintElement && node.dataset.pasword !== 'password') hintElement.innerHTML = ''
      node.classList.remove('fail')
    })
    for (const issue of issues) {
      Array.from(allInputs).forEach((node) => {
        const path = issue.path && issue.path.length ? issue.path.join('+++') : null
        if (path && path === node.id) {
          // const plural = (node as HTMLInputElement).maxLength == 1 ? '' : 's'
          const hintElement = node.parentNode?.querySelector('.hint')
          node.setCustomValidity(issue.message)
          node.classList.add('fail')
          if (hintElement && node.dataset.pasword !== 'password') hintElement.innerHTML = issue.message
        }
        node.addEventListener('focus', (event) => {
          event.target.classList.remove('fail')
          const hintElement = node.parentNode?.querySelector('.hint')
          if (hintElement && node.dataset.pasword !== 'password') hintElement.innerHTML = ''
        })
      })
    }

    return false
  }

  return {
    appErrorMsg,
    clientFormValidator,
    parseZodError,
    resetForm,
  }
}
export default useErrorStore
