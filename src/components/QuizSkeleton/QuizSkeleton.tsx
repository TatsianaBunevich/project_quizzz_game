import Skeleton from '../Skeleton/Skeleton'
import Footer from '../../components/Footer/Footer'
import stylesQuizPage from '../../pages/QuizPage/QuizPage.module.css'
import stylesQuiz from '../Quiz/Quiz.module.css'
import stylesQuizItem from '../QuizItem/QuizItem.module.css'
import stylesAnswerButton from '../AnswerButton/AnswerButton.module.css'
import stylesControl from '../ControlButton/ControlButton.module.css'
import styles from './QuizSkeleton.module.css'

const QuizSkeleton = () => {
  return (
    <>
      <main className={stylesQuizPage.quizItemWrap}>
        <div className={`${stylesQuiz.quiz} ${styles.skeleton}`}>
          <div className={`${stylesQuizItem.quizItem} ${styles.quizItem}`}>
            <div className={stylesQuizItem.id}>
              <Skeleton width="1.5em" height="2em" />
            </div>
            <h2 className={`${stylesQuizItem.title} ${styles.title}`}>
              <Skeleton width="100%" height="1em" />
              <Skeleton width="100%" height="1em" />
            </h2>
            <div className={stylesQuizItem.answers}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`${stylesAnswerButton.answerButton} ${styles.answer}`}
                >
                  <Skeleton width="100%" height="1em" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer>
        <Skeleton
          className={`${stylesControl.controlButton} ${stylesQuizPage.footerButton}`}
          width="12em"
          height="4em"
        />
        <Skeleton
          className={`${stylesControl.controlButton} ${stylesQuizPage.footerButton}`}
          width="12em"
          height="4em"
        />
        <Skeleton
          className={`${stylesControl.controlButton} ${stylesQuizPage.footerButton} ${stylesQuizPage.stopButton}`}
          width="12em"
          height="4em"
        />
      </Footer>
    </>
  )
}

export default QuizSkeleton
