import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from '../../store/boundStore'
import { useShallow } from 'zustand/react/shallow'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from '../../components/Fallback/Fallback'
import { lazy, Suspense, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from '../../components/Countdown/Countdown'
import QuizSkeleton from '../../components/QuizSkeleton/QuizSkeleton'
const Quiz = lazy(() => import('../../components/Quiz/Quiz'))
import Footer from '../../components/Footer/Footer'
import PathConstants from '../../routes/pathConstants'
import ControlButton from '../../components/ControlButton/ControlButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import Timer from '../../components/Timer/Timer'
import Modal from '../../components/Modal/Modal'
import { SettingsType, SettingType } from '../../types'
import styles from './QuizPage.module.css'

const QuizPage = () => {
  const { reset } = useQueryErrorResetBoundary()
  const {
    settings,
    quizItems,
    activeId,
    sortQuizItems,
    handleSelectAnswer,
    startTimer,
    handlePrevButton,
    handleNextButton,
    startCountdown,
    timer,
    resetQuiz,
    stopTimer,
    restartTimer,
  } = useBoundStore(
    useShallow((state) => ({
      settings: state.settings,
      quizItems: state.quizItems,
      activeId: state.activeId,
      sortQuizItems: state.sortQuizItems,
      handleSelectAnswer: state.handleSelectAnswer,
      startTimer: state.startTimer,
      handlePrevButton: state.handlePrevButton,
      handleNextButton: state.handleNextButton,
      startCountdown: state.startCountdown,
      timer: state.settings.timer,
      resetQuiz: state.resetQuiz,
      stopTimer: state.stopTimer,
      restartTimer: state.restartTimer,
    }))
  )
  const navigate = useNavigate()
  const [isCountdown, setIsCountdown] = useState(true)
  const [isModal, setIsModal] = useState(false)
  const lastQuizItem = quizItems.length - 1
  const progress = useRef<HTMLDivElement>(null)
  const oldLength = useRef(0)
  const newLength = (activeId / (quizItems.length - 1)) * 100

  useEffect(() => {
    if (isCountdown) {
      startCountdown()
        .then(() => setIsCountdown(false))
        .catch((error) => console.error(error))
    } else if (timer) {
      if (activeId === lastQuizItem) {
        startTimer(timer, () => {
          handleNextButton()
          navigate(PathConstants.RESULT)
        })
      } else {
        startTimer()
      }
    }
  }, [
    activeId,
    handleNextButton,
    isCountdown,
    lastQuizItem,
    navigate,
    startCountdown,
    startTimer,
    timer,
  ])

  useEffect(() => {
    if (progress.current) {
      progress.current.style.animation = 'none'
      progress.current.offsetHeight
      progress.current.style.setProperty(
        '--old-length',
        `${oldLength.current}%`
      )
      progress.current.style.setProperty('--new-length', `${newLength}%`)
      progress.current.style.animation = 'progress 0.5s normal forwards'
      oldLength.current = newLength
    }
  }, [newLength])

  const createQuestionsUrl = (settings: SettingsType) => {
    const createSettingId = (setting: SettingType[]) => {
      const foundItem = setting.find(
        (item: SettingType) => item.isSelected === true
      )
      return foundItem?.id === 'any' ? '' : foundItem?.id
    }
    const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`

    return `https://opentdb.com/api.php?${params}`
  }

  const handleOpenModal = () => {
    if (timer) stopTimer()
    setIsModal(true)
  }

  const handleCloseModal = () => {
    if (timer) restartTimer()
    setIsModal(false)
  }

  const handleCheckAnswers = () => {
    useBoundStore.setState(
      { activeId: lastQuizItem },
      undefined,
      'quiz/getLastQuizItemId'
    )
    handleNextButton()
    setIsModal(false)
  }

  const handleOpenSettings = () => {
    resetQuiz()
    setIsModal(false)
  }

  return (
    <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
      {isCountdown && <Countdown />}
      <div
        className={`${styles.quizWrap} ${!isCountdown ? styles.active : ''}`}
      >
        <Suspense fallback={<QuizSkeleton />}>
          <main className={styles.quizItemWrap}>
            <Quiz
              params={createQuestionsUrl(settings)}
              isSortQuizItems={!quizItems.length}
              quizItem={quizItems[activeId]}
              activeId={activeId}
              sortQuizItems={sortQuizItems}
              handleSelectAnswer={handleSelectAnswer}
            />
          </main>
          <Footer>
            <ControlButton
              to={activeId === 0 ? PathConstants.SETTINGS : ''}
              className={styles.footerButton}
              onClick={handlePrevButton}
              disabled={timer > 0 && activeId > 0}
            >
              {activeId === 0 ? (
                'Back'
              ) : (
                <FontAwesomeIcon icon={faChevronLeft} />
              )}
            </ControlButton>
            <ControlButton
              to={activeId === lastQuizItem ? PathConstants.RESULT : ''}
              className={styles.footerButton}
              onClick={handleNextButton}
            >
              {activeId === lastQuizItem ? (
                'Check'
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </ControlButton>
            <ControlButton
              className={`${styles.footerButton} ${styles.stopButton}`}
              onClick={handleOpenModal}
            >
              Stop
            </ControlButton>
          </Footer>
          <div className={styles.quizProgress} ref={progress}></div>
          {timer > 0 && <Timer />}
          <Modal isModal={isModal}>
            <h2>Do you want to</h2>
            <ControlButton
              className={styles.modalButton}
              onClick={handleCloseModal}
            >
              Back to the game
            </ControlButton>
            <ControlButton
              className={styles.modalButton}
              to={PathConstants.RESULT}
              onClick={handleCheckAnswers}
            >
              See the result
            </ControlButton>
            <ControlButton
              className={styles.modalButton}
              to={PathConstants.SETTINGS}
              onClick={handleOpenSettings}
            >
              Go to settings
            </ControlButton>
          </Modal>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default QuizPage
