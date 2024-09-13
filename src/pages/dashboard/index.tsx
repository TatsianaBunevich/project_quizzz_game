import { useState } from 'react'
import useBoundStore from 'store/bound-store'
import ResultData from 'custom/result-data'
import ResultScoreboard from 'custom/result-scoreboard'
import ResultAnswers from 'custom/result-answers'

const ResultPage = () => {
  const goal = useBoundStore((state) => state.quizItems.length)
  const scores = useBoundStore((state) => state.scores)
  const quizItems = useBoundStore((state) => state.quizItems)
  const [quizItemId, setQuizItemId] = useState(quizItems.length - 1)

  const handlePrevClick = () => {
    setQuizItemId((quizItemId) => (quizItemId -= 1))
  }
  const handleNextClick = () => {
    setQuizItemId((quizItemId) => (quizItemId += 1))
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex w-full flex-col gap-4 md:w-1/2 xl:w-2/3">
        <ResultData score={scores[scores.length - 1]} goal={goal} />
        <ResultScoreboard scores={scores} />
      </div>
      <ResultAnswers
        quizItem={quizItems[quizItemId]}
        quizItemId={quizItemId}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
        length={quizItems.length - 1}
      />
    </div>
  )
}

export default ResultPage
