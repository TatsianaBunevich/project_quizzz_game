import useBoundStore from 'store/bound-store'
import { cn } from '@/lib/utils'
import MainLayout from 'layouts/main-layout'
import PathConstants from 'routes/constants'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'

const HomePage = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <MainLayout>
      <MainLayout.Header isFixed />
      <MainLayout.Main className="items-center justify-center text-center">
        <h1>Quizzz Game</h1>
        <Button asChild onClick={toggleIsPlay}>
          <Link to={PathConstants.SETTINGS}>START</Link>
        </Button>
      </MainLayout.Main>
      <MainLayout.Footer
        isAbsolute
        className="absolute bottom-0 flex rotate-180 flex-col [writing-mode:vertical-lr]"
      >
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
      </MainLayout.Footer>
    </MainLayout>
  )
}

export default HomePage
