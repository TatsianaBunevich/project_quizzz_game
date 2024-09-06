import useGetData from 'hooks/useGetData'
import { QuestionsResponse, QuizItemType } from '@/types'
import { QuizState, QuizActions } from '../../store/types'
import QuizItem from '../QuizItem/QuizItem'
import AnswerButton from '../AnswerButton/AnswerButton'
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer'
import styles from './Quiz.module.css'

interface QuizProps
  extends Pick<QuizState, 'activeId'>,
    Pick<QuizActions, 'sortQuizItems' | 'handleSelectAnswer'> {
  params: string
  isSortQuizItems: boolean
  quizItem: QuizItemType
}

const Quiz = ({
  params,
  isSortQuizItems,
  quizItem,
  activeId,
  sortQuizItems,
  handleSelectAnswer,
}: QuizProps) => {
  useGetData<QuestionsResponse>(
    'questions',
    params,
    isSortQuizItems ? sortQuizItems : undefined
  )

  return (
    <div className={styles.quiz}>
      <QuizItem>
        <QuizItem.Id id={activeId} />
        <QuizItem.Title title={quizItem.question} />
        <QuizItem.Options>
          {quizItem.answers.map((a) => (
            <AnswerButton
              key={a.answer}
              className={a.isSelected ? styles.selected : ''}
              onClick={() => handleSelectAnswer(activeId, a.answer)}
            >
              <DisplayedAnswer text={a.answer} />
            </AnswerButton>
          ))}
        </QuizItem.Options>
      </QuizItem>
    </div>
  )
}

export default Quiz
