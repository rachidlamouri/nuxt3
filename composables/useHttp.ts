import ISignupData from '~~/ToDeelete/types/ISignupData'
import IProduct from '~~/ToDeelete/types/IProduct'

const useHttp = () => {
  const baseUrl = '/api/v1/'
  const fetchAll = async (resource: string, params: object = {}, body = {}, method = 'GET') => {
    return await useFetch(resource, {
      method: 'GET',
      baseURL: baseUrl,
      params,
    })
  }

  return {
    fetchAll,
  }
}

export default useHttp
