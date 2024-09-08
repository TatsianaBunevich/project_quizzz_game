import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'
import { useShallow } from 'zustand/react/shallow'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from 'shared/fallback'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from 'components/Countdown/Countdown'
import QuizSkeleton from 'components/QuizSkeleton/QuizSkeleton'
import MainLayout from 'layouts/main-layout'
import { cn } from '@/lib/utils'
const Quiz = lazy(() => import('components/Quiz/Quiz'))
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Undo2,
  Goal,
  Settings,
} from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import Timer from 'components/Timer/Timer'
import Modal from 'components/Modal/Modal'
import PathConstants from 'routes/pathConstants'
import { SettingsType, SettingType } from '@/types'

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
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <div vaul-drawer-wrapper="">
        <div className="bg-background">
          <MainLayout>
            <MainLayout.Header isFixed={isCountdown} />
            <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
              {isCountdown && <Countdown />}
              <div className={cn({ hidden: isCountdown, block: !isCountdown })}>
                <Suspense fallback={<QuizSkeleton />}>
                  <MainLayout.Main className="justify-between">
                    <Quiz
                      params={createQuestionsUrl(settings)}
                      isSortQuizItems={!quizItems.length}
                      quizItem={quizItems[activeId]}
                      activeId={activeId}
                      sortQuizItems={sortQuizItems}
                      handleSelectAnswer={handleSelectAnswer}
                    />
                    {/* TODO: move Drawer to separate component */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        {/* TODO: update handleOpenModal */}
                        <Button variant="outline" onClick={handleOpenModal}>
                          <Pause />
                        </Button>
                      </DrawerTrigger>
                      {/* TODO: add action on drag Drawer down and on Overlay click */}
                      <DrawerContent>
                        <DrawerHeader className="p-0">
                          <DrawerTitle></DrawerTitle>
                          <DrawerDescription></DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col justify-center gap-2 p-4 sm:flex-row [&>*>span]:ml-2">
                          <DrawerClose asChild>
                            {/* TODO: check actions on close */}
                            <Button
                              variant="link"
                              onClick={handleCloseModal}
                              className="hover:bg-accent"
                            >
                              <Undo2 />
                              <span>Back to the game</span>
                            </Button>
                          </DrawerClose>
                          <Button
                            variant="link"
                            asChild
                            onClick={handleCheckAnswers}
                          >
                            <Link
                              to={PathConstants.RESULT}
                              className="hover:bg-accent"
                            >
                              <Goal />
                              <span>See the result</span>
                            </Link>
                          </Button>
                          <Button
                            variant="link"
                            asChild
                            onClick={handleOpenSettings}
                          >
                            <Link
                              to={PathConstants.SETTINGS}
                              className="hover:bg-accent"
                            >
                              <Settings />
                              <span>Go to settings</span>
                            </Link>
                          </Button>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </MainLayout.Main>
                  <MainLayout.Footer>
                    <Pagination>
                      <PaginationContent className="w-full justify-center gap-4 [&>*>*]:w-full [&>*]:w-full md:[&>*]:w-1/5">
                        <PaginationItem>
                          <Button
                            asChild
                            onClick={handlePrevButton}
                            disabled={timer > 0 && activeId > 0}
                          >
                            <Link
                              to={activeId === 0 ? PathConstants.SETTINGS : ''}
                            >
                              {activeId === 0 ? 'Back' : <ChevronLeft />}
                            </Link>
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <Button asChild onClick={handleNextButton}>
                            <Link
                              to={
                                activeId === lastQuizItem
                                  ? PathConstants.RESULT
                                  : ''
                              }
                            >
                              {activeId === lastQuizItem ? (
                                'Check'
                              ) : (
                                <ChevronRight />
                              )}
                            </Link>
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </MainLayout.Footer>
                  {timer > 0 && <Timer />}
                </Suspense>
              </div>
            </ErrorBoundary>
          </MainLayout>
        </div>
      </div>
    </>
  )
}

export default QuizPage
