import useBoundStore from 'store/boundStore'
import { ScrollArea, ScrollBar } from 'ui/scroll-area'
import { Button } from 'ui/button'
import ScoreboardTable from 'custom/scoreboard-table'

const ScoreboardPage = () => {
  const scores = useBoundStore((state) => state.scores)
  const resetScores = useBoundStore((state) => state.resetScores)

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={resetScores}>Clear</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-72px-2rem-40px-1rem-2px)] overflow-hidden rounded-xl border">
        <ScoreboardTable scores={scores} />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  )
}

export default ScoreboardPage
