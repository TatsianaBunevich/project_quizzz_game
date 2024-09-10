import { useQueryClient } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'

const useResetGame = () => {
  const queryClient = useQueryClient()
  const resetBoundStore = useBoundStore((state) => state.resetBoundStore)

  return () => {
    resetBoundStore()
    queryClient.clear()
  }
}

export default useResetGame
