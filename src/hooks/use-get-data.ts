import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetcher = async <T>(url: string) => {
  const response = await axios.get<T>(url)
  return response.data
}

const useGetData = <T>(
  key: string,
  url: string,
  select: ((data: T) => void) | undefined
) => {
  return useSuspenseQuery({
    queryKey: [key],
    queryFn: () => fetcher<T>(url),
    select,
    staleTime: Infinity,
  })
}

export default useGetData
