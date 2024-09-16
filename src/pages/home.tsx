import useBoundStore from 'store/bound-store'
import { cn } from '@/lib/utils'
import MainLayout from 'layouts/main-layout'
import PathConstants from 'routes/constants'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { motion } from 'framer-motion'

const HomePage = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="h-full"
      >
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
      </motion.div>
    </MainLayout>
  )
}

export default HomePage
