import useBoundStore from 'store/bound-store'
import { motion } from 'framer-motion'
import { Sparkle } from 'lucide-react'

const QuizCountdown = () => {
  const timeLeft = useBoundStore((state) => state.timeLeft)
  const counter =
    timeLeft === 5 ? timeLeft - 2 : timeLeft === 1 ? 'GO!' : timeLeft - 1

  return (
    <div className="flex h-screen">
      <div className="relative m-auto font-qalisso text-7xl font-bold">
        <span className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground">
          <motion.span
            initial={{ transform: 'rotate(0deg)' }}
            animate={{
              transition: {
                duration: 2,
                ease: 'circInOut',
                repeat: Infinity,
              },
              transform: 'rotate(360deg)',
            }}
            className="absolute left-6 top-6 h-48 w-48"
          >
            <Sparkle />
          </motion.span>
          <motion.span
            initial={{ transform: 'rotate(0deg)' }}
            animate={{
              transition: {
                duration: 2,
                ease: 'circInOut',
                repeat: Infinity,
                delay: 0.5,
              },
              transform: 'rotate(360deg)',
            }}
            className="absolute left-6 top-6 h-48 w-48"
          >
            <Sparkle />
          </motion.span>
        </span>

        <motion.div
          initial={{ transform: 'translate(0, 0) skew(0deg)' }}
          animate={{
            transition: {
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
              times: [0.02, 0.04, 0.6, 0.62, 0.64],
            },
            transform: [
              'translate(2px, 0) skew(0deg)',
              'translate(-2px, 0) skew(0deg)',
              'translate(-2px, 0) skew(0deg)',
              'translate(0, 0) skew(5deg)',
              'translate(2px, 0) skew(0deg)',
            ],
          }}
        >
          <motion.span
            initial={{ transform: 'translate(0, 0)' }}
            animate={{
              transition: {
                duration: 1,
                ease: 'linear',
                repeat: Infinity,
                times: [0.02, 0.04, 0.6, 0.62, 0.64],
              },
              transform: [
                'translate(2px, -2px)',
                'translate(-2px, 2px)',
                'translate(-2px, 2px)',
                'translate(13px, -1px) skew(-13deg)',
                'translate(2px, -2px)',
              ],
            }}
            className="absolute left-0 top-0 -z-10 text-pink-500 [clip-path:polygon(0_0,100%_0,100%_33%,0_33%)]"
          >
            {counter}
          </motion.span>
          <motion.span
            initial={{ transform: 'translate(0, 0)' }}
            animate={{
              transition: {
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity,
                times: [0.02, 0.04, 0.6, 0.62, 0.64],
              },
              transform: [
                'translate(-2px, 0)',
                'translate(-2px, 0)',
                'translate(-2px, 0)',
                'translate(-22px, 5px) skew(21deg)',
                'translate(-2px, 0)',
              ],
            }}
            className="absolute bottom-0 left-0 -z-10 text-cyan-500 [clip-path:polygon(0_67%,100%_67%,100%_100%,0_100%)]"
          >
            {counter}
          </motion.span>
          <span>{counter}</span>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizCountdown
