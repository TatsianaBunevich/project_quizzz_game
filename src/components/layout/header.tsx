import useResetQuiz from 'hooks/useResetQuiz'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { ModeToggle } from 'components/mode-toggle'
import PathConstants from 'routes/pathConstants'

const Header = ({ className }: React.ComponentProps<'header'>) => {
  return (
    <header className={cn('flex items-center justify-between p-4', className)}>
      <Button variant="link" asChild onClick={useResetQuiz}>
        <Link to={PathConstants.HOME}>QG</Link>
      </Button>
      <ModeToggle />
    </header>
  )
}

export default Header
