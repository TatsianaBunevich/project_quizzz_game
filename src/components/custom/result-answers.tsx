import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from 'ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import DisplayedAnswer from 'custom/displayed-answer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QuizItemType } from '@/types'
import PathConstants from 'routes/pathConstants'

interface ResultAnswersProps {
  quizItem: QuizItemType
  quizItemId: number
  handlePrevClick: () => void
  handleNextClick: () => void
  length: number
}

const ResultAnswers = ({
  quizItem,
  quizItemId,
  handlePrevClick,
  handleNextClick,
  length,
}: ResultAnswersProps) => {
  return (
    <Card className="flex flex-1 flex-col justify-between md:h-[calc(100vh-72px-2rem)]">
      <CardHeader className="space-y-6 border-b bg-muted/50">
        <div className="flex flex-row flex-nowrap justify-between gap-4">
          <span className="h-10 w-10 rounded-full bg-accent-foreground text-center font-bold leading-10 text-accent">
            {quizItemId + 1}
          </span>
          <Button variant="outline">
            <Link to={PathConstants.ANSWERS}>
              Show All
              <span className="sr-only">Show All</span>
            </Link>
          </Button>
        </div>
        <CardTitle
          dangerouslySetInnerHTML={{ __html: quizItem.question }}
          className="text-wrap text-lg"
        ></CardTitle>
      </CardHeader>
      <CardContent className="mb-auto grid gap-4 pt-6 [counter-reset:els]">
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
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        {!quizItem.answers.some((item) => item.isSelected) && (
          <Badge variant="outline">Unanswered</Badge>
        )}

        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                disabled={quizItemId === 0}
                onClick={handlePrevClick}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous question</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                disabled={quizItemId === length}
                onClick={handleNextClick}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next question</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}

export default ResultAnswers
