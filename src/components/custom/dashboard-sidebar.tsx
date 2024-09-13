import { Link, useMatch } from 'react-router-dom'
import useBoundStore from 'store/boundStore'
import { cn } from '@/lib/utils'
import { Button } from 'ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  ListCheck,
  LineChart,
  DiamondPlus,
  Settings,
} from 'lucide-react'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/pathConstants'

const DashboardSidebar = () => {
  const handleNewTry = useBoundStore((state) => state.handleNewTry)
  const resetQuiz = useBoundStore((state) => state.resetQuiz)
  const resetGame = useResetGame()

  const useLinkClasses = (path: string) =>
    cn(
      'flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground',
      {
        'bg-accent text-accent-foreground': useMatch(path),
        'text-muted-foreground': !useMatch(path),
      }
    )

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col justify-between border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 px-2 pt-4 md:gap-4">
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={PathConstants.RESULT}
              className={useLinkClasses(PathConstants.RESULT)}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">Result</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Result</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={PathConstants.ANSWERS}
              className={useLinkClasses(PathConstants.ANSWERS)}
            >
              <ListCheck className="h-5 w-5" />
              <span className="sr-only">Answers</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Answers</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={PathConstants.SCOREBOARD}
              className={useLinkClasses(PathConstants.SCOREBOARD)}
            >
              <LineChart className="h-5 w-5" />
              <span className="sr-only">Scores</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Scores</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild onClick={handleNewTry}>
            <Link
              to={PathConstants.QUIZ}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <DiamondPlus className="h-5 w-5" />
              <span className="sr-only">Try again</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Try again</TooltipContent>
        </Tooltip>
      </nav>
      <nav className="flex flex-col items-center gap-2 px-2 pb-4 md:gap-4">
        <Tooltip>
          <TooltipTrigger asChild onClick={resetQuiz}>
            <Link
              to={PathConstants.SETTINGS}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  )
}

export default DashboardSidebar
