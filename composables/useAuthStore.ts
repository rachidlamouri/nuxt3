import { IAuthenticatedData } from '~/utils/schema'

const useAuthStore = () => {
  const authUser = useState('authUser', (): IAuthenticatedData => {
    return {}
  })

  const isAuthenticated = computed(() => (authUser.value.isAuthenticated ? true : false))

  return {
    authUser,
    isAuthenticated,
  }
}
export default useAuthStore
