import useBoundStore from 'store/boundStore'
import { cn } from '@/lib/utils'
import Header from 'layout/header'
import PathConstants from 'routes/pathConstants'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'

const HomePage = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <>
      <Header className="fixed top-0 w-full" />
      <main className="flex h-lvh flex-col items-center justify-center text-center">
        <h1>Quizzz Game</h1>
        <Button asChild onClick={toggleIsPlay}>
          <Link to={PathConstants.SETTINGS}>START</Link>
        </Button>
      </main>
      <footer className="absolute bottom-0 flex rotate-180 flex-col [writing-mode:vertical-lr]">
        <p className={cn('order-last hidden md:block')}>
          Feeling fun? Got an idea?
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/tatsiana-bunevich/"
            target="_blank"
            rel="noreferrer"
          >
            contact the creator
          </a>
        </p>
      </footer>
    </>
  )
}

export default HomePage
