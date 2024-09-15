import useGetData from 'hooks/use-get-data'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from 'components/ui/card'
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
}

const QuizItem = ({
  params,
  isSortQuizItems,
  quizItem,
  activeId,
  sortQuizItems,
  handleSelectAnswer,
}: QuizProps) => {
  useGetData<QuestionsResponse>(
    'questions',
    params,
    isSortQuizItems ? sortQuizItems : undefined
  )

  return (
    <>
      <div className="item-mask-top ml-8 h-14 w-[calc(100%-2rem)] bg-muted/50" />
      <Card className="mb-6 flex flex-col overflow-hidden rounded-3xl rounded-se-none border-0 shadow-none md:h-[calc(100%-3.5rem-1.5rem)]">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle
            dangerouslySetInnerHTML={{ __html: quizItem.question }}
            className="text-wrap"
          />
        </CardHeader>
        <CardContent className="flex-1 border-x">
          <div className="grid auto-rows-fr gap-4 pt-6 [counter-reset:els] sm:grid-cols-2">
            {quizItem.answers.map((a) => (
              <Button
                key={a.answer}
                variant={a.isSelected ? 'default' : 'outline'}
                className="item-answer"
                onClick={() => handleSelectAnswer(activeId, a.answer)}
              >
                <DisplayedAnswer text={a.answer} />
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="item-mask-bottom border-t bg-muted/50 pb-20" />
      </Card>
    </>
  )
}

export default QuizItem
