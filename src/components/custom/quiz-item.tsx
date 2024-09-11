import useGetData from 'hooks/use-get-data'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Button } from 'ui/button'
import DisplayedAnswer from 'custom/displayed-answer'
import { QuestionsResponse, QuizItemType } from '@/types'
import { QuizState, QuizActions } from 'store/types'

interface QuizProps
  extends Pick<QuizState, 'activeId'>,
    Pick<QuizActions, 'sortQuizItems' | 'handleSelectAnswer'> {
  params: string
  isSortQuizItems: boolean
  quizItem: QuizItemType
  isTimer: boolean
}

const QuizItem = ({
  params,
  isSortQuizItems,
  quizItem,
  activeId,
  sortQuizItems,
  handleSelectAnswer,
  isTimer,
}: QuizProps) => {
  useGetData<QuestionsResponse>(
    'questions',
    params,
    isSortQuizItems ? sortQuizItems : undefined
  )

  return (
    <>
      <Card
        className={cn(
          'relative grid min-h-[calc(100vh-72px*2-40px*2-0.5rem*2)] items-start rounded-2xl border-0 bg-accent [filter:url(#gooey)] before:absolute before:-top-12 before:start-12 before:-z-10 before:h-16 before:border-inherit before:bg-inherit after:absolute after:-bottom-12 after:end-12 after:-z-10 after:h-16 after:w-[calc(100%-3rem)] after:border-inherit after:bg-inherit',
          { 'before:end-14': isTimer, 'before:end-0': !isTimer }
        )}
      >
        <CardHeader>
          <CardTitle
            dangerouslySetInnerHTML={{ __html: quizItem.question }}
            className="text-wrap"
          />
        </CardHeader>
        <CardContent className="grid auto-rows-fr gap-4 [counter-reset:els] sm:grid-cols-2 sm:pt-6">
          {quizItem.answers.map((a) => (
            <Button
              key={a.answer}
              variant={a.isSelected ? 'default' : 'outline'}
              className="after:-top-7.5 relative h-full justify-start overflow-hidden whitespace-normal p-4 text-left before:mr-4 before:content-[counter(els,upper-alpha)] before:[counter-increment:els] after:absolute after:right-[calc(100%-2.5rem)] after:aspect-square after:h-[120%] after:w-auto after:rounded-full after:border after:border-inherit"
              onClick={() => handleSelectAnswer(activeId, a.answer)}
            >
              <DisplayedAnswer text={a.answer} />
            </Button>
          ))}
        </CardContent>
      </Card>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="absolute hidden"
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  )
}

export default QuizItem
