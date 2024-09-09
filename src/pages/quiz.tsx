import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'
import { useShallow } from 'zustand/react/shallow'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from 'shared/fallback'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizCountdown from 'custom/quiz-countdown'
import QuizSkeleton from 'custom/quiz-skeleton'
import MainLayout from 'layouts/main-layout'
import { cn } from '@/lib/utils'
const QuizItem = lazy(() => import('custom/quiz-item'))
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'

import QuizTimer from 'custom/quiz-timer'
import QuizDrawer from 'custom/quiz-drawer'
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
    }))
  )
  const navigate = useNavigate()
  const [isCountdown, setIsCountdown] = useState(true)
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

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <div vaul-drawer-wrapper="">
        <div className="bg-background">
          <MainLayout>
            <MainLayout.Header isFixed={isCountdown} />
            <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
              {isCountdown && <QuizCountdown />}
              <div
                className={cn({
                  hidden: isCountdown,
                  'flex h-full flex-col': !isCountdown,
                })}
              >
                <Suspense fallback={<QuizSkeleton />}>
                  <MainLayout.Main className="justify-between">
                    <div className="flex min-h-full flex-col">
                      <div className="mb-2 flex items-end justify-between">
                        <span className="h-10 w-10 rounded-full bg-accent-foreground text-center leading-10 text-accent">
                          {activeId + 1}
                        </span>
                        {timer > 0 && <QuizTimer />}
                      </div>
                      <QuizItem
                        params={createQuestionsUrl(settings)}
                        isSortQuizItems={!quizItems.length}
                        quizItem={quizItems[activeId]}
                        activeId={activeId}
                        sortQuizItems={sortQuizItems}
                        handleSelectAnswer={handleSelectAnswer}
                        isTimer={timer ? true : false}
                      />
                      <QuizDrawer lastQuizItem={lastQuizItem} />
                    </div>
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
