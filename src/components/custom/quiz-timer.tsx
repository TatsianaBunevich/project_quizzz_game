import useBoundStore from 'store/bound-store'
import { secondsToHms } from '@/helpers'

const QuizTimer = () => {
  const timeLeft = useBoundStore((state) => state.timeLeft)
  return <span>{secondsToHms(timeLeft)}</span>
}

export default QuizTimer
