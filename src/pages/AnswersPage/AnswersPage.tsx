import useBoundStore from '../../store/boundStore'
import Answers from '../../components/Answers/Answers'
import PathConstants from '../../routes/pathConstants'
import ControlButton from '../../components/ControlButton/ControlButton'
import styles from './AnswersPage.module.css'

const AnswersPage = () => {
  const quizItems = useBoundStore((state) => state.quizItems)

  return (
    <>
      <main>
        <Answers quizItems={quizItems} />
      </main>
      <footer>
        <ControlButton
          to={PathConstants.RESULT}
          className={styles.footerButton}
        >
          Back
        </ControlButton>
      </footer>
    </>
  )
}

export default AnswersPage
