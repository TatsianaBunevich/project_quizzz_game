import { useQueryClient } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'

const useResetQuiz = () => {
  const queryClient = useQueryClient()
  const resetBoundStore = useBoundStore((state) => state.resetBoundStore)

  resetBoundStore()
  queryClient.clear()
}

export default useResetQuiz
