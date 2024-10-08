import useBoundStore from 'store/bound-store'
import MainLayout from 'layouts/main-layout'
import PathConstants from 'routes/constants'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
const HomeScene = lazy(() => import('custom/home-scene'))

const HomePage = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <MainLayout>
      <Suspense fallback={null}>
        <Canvas
          camera={{
            position: [0, 0, 12],
          }}
        >
          <HomeScene />
        </Canvas>
        <MainLayout.Header isFixed />
        <div className="absolute top-1/2 w-full -translate-y-1/2">
          <h1 className="w-full text-center font-qalisso leading-none">
            <span className="text-4xl tracking-wide text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground))] md:text-[11vw]">
              Quizzz Game
            </span>
          </h1>
        </div>
        <Button
          asChild
          onClick={toggleIsPlay}
          className="absolute -bottom-8 right-[10vw] h-16 w-16 rounded-full p-0 md:-bottom-12 md:h-24 md:w-24"
        >
          <motion.div whileHover={{ bottom: 10 }} whileTap={{ bottom: 10 }}>
            <Link to={PathConstants.SETTINGS} className="h-full w-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <path
                    id="circle"
                    d="M 150, 150 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
                    fill="none"
                  />
                  <circle
                    r="30"
                    cx="150"
                    cy="150"
                    className="fill-background"
                  />
                  <text className="fill-background text-5xl font-bold">
                    <textPath xlinkHref="#circle" startOffset="10%">
                      *
                    </textPath>
                    <textPath xlinkHref="#circle" startOffset="25%">
                      START
                    </textPath>
                    <textPath xlinkHref="#circle" startOffset="60%">
                      *
                    </textPath>
                    <textPath xlinkHref="#circle" startOffset="75%">
                      START
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        </Button>
        <MainLayout.Footer isAbsolute className="absolute bottom-0">
          <div className="flex rotate-180 flex-col rounded-se-[5rem] border-e border-l border-pink-300 p-4 [writing-mode:vertical-lr]">
            <p className="order-last hidden md:block">
              Feeling fun? Got an idea?
            </p>
            <div>
              <a
                href="https://www.linkedin.com/in/tatsiana-bunevich/"
                target="_blank"
                rel="noreferrer"
              >
                <motion.div
                  animate={{ backgroundPosition: 'center -200%' }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="font-amelliaScript bg-[linear-gradient(to_top,var(--indigo-400),var(--indigo-100),var(--sky-400),var(--fuchsia-400),var(--sky-400),var(--indigo-100),var(--indigo-400))] bg-[length:auto_200%] bg-clip-text text-4xl font-black text-transparent"
                >
                  contact the creator
                </motion.div>
              </a>
            </div>
          </div>
        </MainLayout.Footer>
      </Suspense>
    </MainLayout>
  )
}

export default HomePage
