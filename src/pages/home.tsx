import useBoundStore from 'store/bound-store'
import MainLayout from 'layouts/main-layout'
import PathConstants from 'routes/constants'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
const Scene = lazy(() => import('custom/home-scene'))
import { Rig, Env } from 'custom/home-scene'

const Text = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <div className="absolute right-0 top-1/2 flex w-3/4 -translate-y-1/2 flex-col items-end md:w-3/5">
      <h1 className="w-full font-qalisso leading-none">
        <div className="w-full overflow-hidden rounded-s-full border border-b-slate-500">
          <div className="m-1 mr-0 rounded-s-full bg-background/10 p-10 shadow-[0px_-5px_20px_0px_rgba(0,0,0,0.25)_inset] backdrop-blur dark:shadow-[0px_-5px_20px_0px_rgba(256,256,256,0.25)_inset] md:p-20">
            <span className="text-4xl text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground))] md:text-7xl">
              Quizzz
            </span>
          </div>
        </div>
        <span className="absolute -bottom-3 left-40 z-10 text-2xl md:-bottom-4 md:left-80 md:text-5xl">
          Game
        </span>
      </h1>
      <Button
        asChild
        onClick={toggleIsPlay}
        className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full p-0 md:h-24 md:w-24"
      >
        <Link to={PathConstants.SETTINGS}>
          <motion.div
            animate={{ rotate: 180 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="h-full w-full"
          >
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <path
                id="circle"
                d="M 150, 150 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
                fill="none"
              />
              <circle r="30" cx="150" cy="150" className="fill-background" />
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
      </Button>
    </div>
  )
}

const HomePage = () => {
  return (
    <MainLayout>
      <Text />
      <Canvas
        camera={{
          position: [0, 0, 12],
        }}
      >
        <Suspense fallback={null}>
          <Scene />
          <Rig />
          <Env />
        </Suspense>
      </Canvas>
      <MainLayout.Header isFixed />
      <MainLayout.Footer isAbsolute className="absolute bottom-0">
        <div className="flex rotate-180 flex-col rounded-se-3xl bg-background/10 p-6 shadow-[0px_-5px_20px_0px_rgba(0,0,0,0.25)_inset] backdrop-blur [writing-mode:vertical-lr] dark:shadow-[0px_-5px_20px_0px_rgba(256,256,256,0.25)_inset]">
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
                animate={{ backgroundPosition: 'center 200%' }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="bg-[linear-gradient(to_top,var(--indigo-400),var(--indigo-100),var(--sky-400),var(--fuchsia-400),var(--sky-400),var(--indigo-100),var(--indigo-400))] bg-[length:auto_200%] bg-clip-text font-black uppercase text-transparent"
              >
                contact the creator
              </motion.div>
            </a>
          </div>
        </div>
      </MainLayout.Footer>
    </MainLayout>
  )
}

export default HomePage
