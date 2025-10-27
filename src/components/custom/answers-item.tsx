import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from 'ui/badge'
import { Button } from 'ui/button'

import DisplayedAnswer from 'custom/displayed-answer'

import { QuizItemType } from '@/types'

interface AnswersItemProps {
  quizItem: QuizItemType
  index: number
}

const AnswersItem = ({ quizItem, index }: AnswersItemProps) => {
  const showItemStatus = () => {
    const statusIndex = quizItem.answers.findIndex((item) => item.isSelected)
    const correctIndex = quizItem.answers.findIndex((item) => item.isCorrect)
    return statusIndex === -1
      ? 'Unanswered'
      : statusIndex === correctIndex
        ? 'Correct'
        : 'Incorrect'
  }

  return (
    <Card className="flex flex-col justify-between @container">
      <CardHeader className="space-y-6 rounded-t-2xl border-b bg-muted/50">
        <div className="flex flex-row flex-nowrap items-start justify-between gap-4">
          <span className="h-10 w-10 rounded-full bg-accent-foreground text-center font-bold leading-10 text-accent">
            {index}
          </span>
          <Badge variant="outline">{showItemStatus()}</Badge>
        </div>
        <CardTitle
          dangerouslySetInnerHTML={{ __html: quizItem.question }}
          className="text-wrap text-lg"
        />
      </CardHeader>
      <CardContent className="mb-auto grid auto-rows-fr gap-4 pt-6 [counter-reset:els] @lg:grid-cols-2">
        {quizItem.answers.map((a) => (
          <Button
            key={a.answer}
            asChild
            variant="outline"
            className={cn('item-answer hover:bg-background', {
              'before:bg-lime-500': a.isSelected && a.isCorrect,
              'before:bg-red-500': a.isSelected && !a.isCorrect,
            })}
          >
            <div>
              <DisplayedAnswer text={a.answer} />
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

export default AnswersItem
