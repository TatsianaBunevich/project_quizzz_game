import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import useBoundStore from '../../store/boundStore'
import { Button } from 'ui/button'
import { ModeToggle } from 'components/mode-toggle'
import PathConstants from 'routes/pathConstants'

const Header = () => {
  const queryClient = useQueryClient()
  const resetBoundStore = useBoundStore((state) => state.resetBoundStore)

  const handleEndQuiz = () => {
    resetBoundStore()
    queryClient.clear()
  }

  return (
    <header className="m-4 flex items-center justify-between">
      <Button variant="link" asChild onClick={handleEndQuiz}>
        <Link to={PathConstants.HOME}>QG</Link>
      </Button>
      <ModeToggle />
    </header>
  )
}

export default Header
