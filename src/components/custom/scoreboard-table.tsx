import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from 'ui/button'
import { Progress } from '@/components/ui/progress'
import DisplayedTime from 'custom/displayed-time'
import { ArrowDownNarrowWide, ArrowDownWideNarrow } from 'lucide-react'
import { Score } from '@/types'
import { ScoresState } from 'store/types'

const ScoreboardTable = ({ scores }: ScoresState) => {
  const [sortedScore, setSortedScore] = useState<Score[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Score
    ascending: boolean
  }>({ key: 'index', ascending: true })

  useEffect(() => {
    const key = sortConfig.key
    const sorted = [...scores].sort((a, b) => {
      if (a[key] === null || b[key] === null) {
        return 0
      }
      if (a[key] < b[key]) return sortConfig.ascending ? -1 : 1
      if (a[key] > b[key]) return sortConfig.ascending ? 1 : -1
      return 0
    })
    setSortedScore(sorted)
  }, [scores, sortConfig.key, sortConfig.ascending])

  const updateSortConfig = (key: keyof Score) => {
    setSortConfig({ key, ascending: !sortConfig.ascending })
  }

  return (
    <div className="[&>*]:overflow-visible">
      <Table>
        <TableHeader className="sticky top-0 z-10 rounded-t-xl bg-secondary">
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => updateSortConfig('index')}
                className="w-full justify-start px-0 before:mr-2 before:content-['#'] hover:bg-transparent md:before:content-['Round']"
              >
                {sortConfig.key === 'index' &&
                  (sortConfig.ascending ? (
                    <ArrowDownNarrowWide className="h-4 w-4" />
                  ) : (
                    <ArrowDownWideNarrow className="h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="w-full justify-start px-0 hover:bg-transparent"
                onClick={() => updateSortConfig('percentage')}
              >
                <span className="mr-2">Score</span>
                {sortConfig.key === 'percentage' &&
                  (sortConfig.ascending ? (
                    <ArrowDownNarrowWide className="h-4 w-4" />
                  ) : (
                    <ArrowDownWideNarrow className="h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead className="w-[170px]">
              <Button
                variant="ghost"
                className="w-full justify-start px-0 hover:bg-transparent"
                onClick={() => updateSortConfig('time')}
              >
                <span className="mr-2">Time</span>
                {sortConfig.key === 'time' &&
                  (sortConfig.ascending ? (
                    <ArrowDownNarrowWide className="h-4 w-4" />
                  ) : (
                    <ArrowDownWideNarrow className="h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedScore.map((score, index) => (
            <TableRow key={index}>
              <TableCell>{score.index}</TableCell>
              <TableCell>
                <div className="relative">
                  <Progress value={score.percentage} className="h-6" />
                  <span className="absolute right-2 top-1/2 -translate-y-2.5 font-bold mix-blend-difference">
                    {score.percentage}{' '}
                    <span className="font-normal text-muted-foreground">%</span>
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {score.time !== null && (
                  <DisplayedTime className="font-bold" seconds={score.time} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ScoreboardTable
