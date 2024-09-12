import { useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import useBoundStore from 'store/boundStore'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import { Button } from 'ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  PanelLeft,
  LayoutDashboard,
  ListCheck,
  LineChart,
  DiamondPlus,
  Settings,
} from 'lucide-react'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/pathConstants'

const DashboardSheet = () => {
  const handleNewTry = useBoundStore((state) => state.handleNewTry)
  const resetQuiz = useBoundStore((state) => state.resetQuiz)
  const resetGame = useResetGame()
  const [status, setStatus] = useState(false)

  const useLinkClasses = (path: string) =>
    cn(
      'flex items-center gap-4 px-4 py-2 text-sm font-medium rounded-full hover:bg-accent hover:text-foreground',
      {
        'bg-accent text-accent-foreground': useMatch(path),
        'text-muted-foreground': !useMatch(path),
      }
    )

  useEffect(() => {
    const handleResize = debounce(
      () => setStatus(window.innerWidth >= 640 && false),
      300
    )
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Sheet open={status} onOpenChange={(val) => setStatus(val)}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen">
        <div className="flex h-full flex-col justify-between gap-2">
          <nav className="grid gap-2">
            <SheetHeader className="text-left">
              <SheetTitle>
                <Button
                  size="icon"
                  asChild
                  className="rounded-full"
                  onClick={() => resetGame()}
                >
                  <Link to={PathConstants.HOME}>
                    <span>QG</span>
                    <span className="sr-only">Quizzz Game</span>
                  </Link>
                </Button>
              </SheetTitle>
              <SheetDescription />
            </SheetHeader>
            <Link
              to={PathConstants.RESULT}
              className={useLinkClasses(PathConstants.RESULT)}
            >
              <LayoutDashboard className="h-5 w-5" /> Result
              <span className="sr-only">Result</span>
            </Link>
            <Link
              to={PathConstants.ANSWERS}
              className={useLinkClasses(PathConstants.ANSWERS)}
            >
              <ListCheck className="h-5 w-5" /> Answers
              <span className="sr-only">Answers</span>
            </Link>
            <Link
              to={PathConstants.SCOREBOARD}
              className={useLinkClasses(PathConstants.SCOREBOARD)}
            >
              <LineChart className="h-5 w-5" /> Scores
              <span className="sr-only">Scores</span>
            </Link>
            <Button variant="link" asChild onClick={handleNewTry}>
              <Link
                to={PathConstants.QUIZ}
                className="flex h-auto items-center !justify-start gap-4 !rounded-full !text-muted-foreground hover:bg-accent hover:!text-foreground hover:no-underline"
              >
                <DiamondPlus className="h-5 w-5" /> Try again
                <span className="sr-only">Try again</span>
              </Link>
            </Button>
          </nav>
          <nav className="grid gap-2">
            <Button variant="link" asChild onClick={resetQuiz}>
              <Link
                to={PathConstants.SETTINGS}
                className="flex h-auto items-center !justify-start gap-4 !rounded-full !text-muted-foreground hover:bg-accent hover:!text-foreground hover:no-underline"
              >
                <Settings className="h-5 w-5" /> Settings
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default DashboardSheet
