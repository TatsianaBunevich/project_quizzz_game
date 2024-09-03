import useResetQuiz from 'hooks/useResetQuiz'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { ModeToggle } from 'components/mode-toggle'
import PathConstants from 'routes/pathConstants'

const Header = () => {
  return (
    <header className="m-4 flex items-center justify-between">
      <Button variant="link" asChild onClick={useResetQuiz}>
        <Link to={PathConstants.HOME}>QG</Link>
      </Button>
      <ModeToggle />
    </header>
  )
}

export default Header
