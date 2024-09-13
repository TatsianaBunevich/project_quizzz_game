import useBoundStore from 'store/bound-store'

const QuizCountdown = () => {
  const timeLeft = useBoundStore((state) => state.timeLeft)
  const counter =
    timeLeft === 5 ? timeLeft - 2 : timeLeft === 1 ? 'GO!' : timeLeft - 1

  return (
    <span className="flex h-full items-center justify-center">{counter}</span>
  )
}

export default QuizCountdown
