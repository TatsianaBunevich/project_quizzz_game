import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { ModeToggle } from 'ui/mode-toggle'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/constants'

interface FooterProps extends React.ComponentProps<'footer'> {
  isAbsolute?: boolean
}

const MainLayout = ({ children, className }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'bg-light-sky dark:bg-dark-sky relative flex min-h-screen flex-col justify-between bg-cover bg-center bg-no-repeat',
        className
      )}
    >
      {children}
    </div>
  )
}

const Header = ({ isFixed }: { isFixed?: boolean }) => {
  const resetGame = useResetGame()

  return (
    <header
      className={cn('flex items-center justify-between p-4', {
        'fixed top-0 w-full': isFixed,
      })}
    >
      <Button
        asChild
        variant="ghost"
        size="icon"
        onClick={() => resetGame()}
        className="rounded-full"
      >
        <Link to={PathConstants.HOME}>
          <span className="text-md font-qalisso font-bold">
            <span className="relative bottom-0.5 left-0.5">Q</span>
            <span className="relative right-0.5 top-0.5">G</span>
          </span>
          <span className="sr-only">Quizzz Game</span>
        </Link>
      </Button>
      <ModeToggle />
    </header>
  )
}

const Main = ({ children, className }: React.ComponentProps<'main'>) => {
  return (
    <main className={cn('container flex h-full flex-col', className)}>
      {children}
    </main>
  )
}

const Footer = ({ isAbsolute, children, className }: FooterProps) => {
  return (
    <footer
      className={cn(
        { 'container flex justify-center gap-4 py-4': !isAbsolute },
        className
      )}
    >
      {children}
    </footer>
  )
}

MainLayout.Header = Header
MainLayout.Main = Main
MainLayout.Footer = Footer

export default MainLayout
