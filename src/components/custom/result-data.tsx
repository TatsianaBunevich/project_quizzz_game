import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { Card, CardContent, CardFooter } from 'ui/card'
import { ChartConfig, ChartContainer } from 'ui/chart'
import DisplayedTime from 'custom/displayed-time'
import { Status, Score } from '@/types'

interface ResultProps {
  goal: number
  score: Score
}

const ResultData = ({ goal, score }: ResultProps) => {
  const statusFill =
    score.status === Status.GOOD
      ? 'good'
      : score.status === Status.NORMAL
        ? 'normal'
        : 'bad'
  const chartScore = (360 * score.percentage) / 100

  const chartData = [
    {
      answers: chartScore,
      fill: `hsl(var(--chart-${statusFill}))`,
    },
  ]

  const chartConfig = {
    answers: {
      label: 'correct answers',
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={chartScore}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="answers" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {score.percentage}
                        </tspan>{' '}
                        <tspan className="fill-foreground text-2xl font-bold">
                          %
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {score.points} of {goal}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {score.time !== null && (
          <DisplayedTime seconds={score.time} className="font-bold" />
        )}
      </CardFooter>
    </Card>
  )
}

export default ResultData
