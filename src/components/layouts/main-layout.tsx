import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { ModeToggle } from 'ui/mode-toggle'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/constants'

interface FooterProps extends React.ComponentProps<'footer'> {
  isAbsolute?: boolean
}

const MainLayout = ({ children }: React.ComponentProps<'div'>) => (
  <div className="relative flex h-screen w-screen flex-col justify-between overflow-hidden">
    {children}
  </div>
)

const Header = ({ isFixed }: { isFixed?: boolean }) => {
  const resetGame = useResetGame()

  return (
    <header
      className={cn('flex items-center justify-between p-4', {
        'fixed top-0 w-full': isFixed,
      })}
    >
      <Button variant="link" asChild onClick={() => resetGame()}>
        <Link to={PathConstants.HOME}>
          <span>QG</span>
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
