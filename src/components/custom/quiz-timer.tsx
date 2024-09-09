import useBoundStore from 'store/boundStore'
import { secondsToHms } from '@/helpers'

const QuizTimer = () => {
  const timeLeft = useBoundStore((state) => state.timeLeft)
  return <span>{secondsToHms(timeLeft)}</span>
}

export default QuizTimer
