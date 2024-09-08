import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { ModeToggle } from 'components/mode-toggle'
import useResetQuiz from 'hooks/useResetQuiz'
import PathConstants from 'routes/pathConstants'

interface FooterProps extends React.ComponentProps<'footer'> {
  isAbsolute?: boolean
}

const MainLayout = ({ children }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex h-screen flex-col justify-between">{children}</div>
)

const Header = ({ isFixed }: { isFixed?: boolean }) => {
  return (
    <header
      className={cn('flex items-center justify-between p-4', {
        'fixed top-0 w-full': isFixed,
      })}
    >
      <Button variant="link" asChild onClick={useResetQuiz}>
        <Link to={PathConstants.HOME}>QG</Link>
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