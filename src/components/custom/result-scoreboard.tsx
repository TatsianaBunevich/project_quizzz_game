import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import DisplayedTime from 'custom/displayed-time'
import { GitCommitVertical } from 'lucide-react'
import { Status, Score } from '@/types'

const ResultScoreboard = ({ scores }: { scores: Score[] }) => {
  const findStatusColor = (s: Score) =>
    s.status === Status.GOOD
      ? 'good'
      : s.status === Status.NORMAL
        ? 'normal'
        : 'bad'

  const chartData = scores

  const chartConfig = {
    scoreboard: {
      label: 'scoreboard',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-1 flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full md:aspect-auto">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 36,
              left: 12,
              right: 12,
              bottom: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value as string}
            />
            <YAxis domain={[0, 100]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      {name === 'percentage' ? 'score' : name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {name === 'percentage' ? (
                          value
                        ) : name === 'time' ? (
                          <DisplayedTime seconds={Number(value)} />
                        ) : (
                          value
                        )}
                        <span className="font-normal text-muted-foreground">
                          {name === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="percentage"
              type="natural"
              stroke="var(--color-scoreboard)"
              strokeWidth={2}
              dot={({
                cx,
                cy,
                payload,
              }: {
                cx: number
                cy: number
                payload: Score
              }) => {
                const r = 24
                return (
                  <GitCommitVertical
                    key={payload.index}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke={`hsl(var(--chart-${findStatusColor(payload)}))`}
                  />
                )
              }}
            />
            <Line dataKey="time" activeDot={false} className="hidden" />
            <Line dataKey="timer" activeDot={false} className="hidden" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ResultScoreboard
