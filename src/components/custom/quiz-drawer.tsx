import useBoundStore from 'store/boundStore'
import { useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Pause, Undo2, Goal, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import PathConstants from 'routes/pathConstants'

const QuizDrawer = ({ lastQuizItem }: { lastQuizItem: number }) => {
  const handleNextButton = useBoundStore((state) => state.handleNextButton)
  const timer = useBoundStore((state) => state.settings.timer)
  const resetQuiz = useBoundStore((state) => state.resetQuiz)
  const stopTimer = useBoundStore((state) => state.stopTimer)
  const restartTimer = useBoundStore((state) => state.restartTimer)
  const [isModal, setIsModal] = useState(false)

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
    <Drawer>
      <DrawerTrigger asChild>
        {/* TODO: update handleOpenModal */}
        <Button
          onClick={handleOpenModal}
          className="mt-2 self-end rounded-full px-2"
        >
          <Pause />
        </Button>
      </DrawerTrigger>
      {/* TODO: add action on drag Drawer down and on Overlay click */}
      <DrawerContent>
        <DrawerHeader className="p-0">
          <DrawerTitle />
          <DrawerDescription />
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
          <Button variant="link" asChild onClick={handleCheckAnswers}>
            <Link to={PathConstants.RESULT} className="hover:bg-accent">
              <Goal />
              <span>See the result</span>
            </Link>
          </Button>
          <Button variant="link" asChild onClick={handleOpenSettings}>
            <Link to={PathConstants.SETTINGS} className="hover:bg-accent">
              <Settings />
              <span>Go to settings</span>
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default QuizDrawer
