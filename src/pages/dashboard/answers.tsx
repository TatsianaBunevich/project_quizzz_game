import useBoundStore from 'store/boundStore'
import { ScrollArea, ScrollBar } from 'ui/scroll-area'
import AnswersItem from 'custom/answers-item'

const AnswersPage = () => {
  const quizItems = useBoundStore((state) => state.quizItems)

  return (
    <div className="faded-bottom">
      <ScrollArea className="z-10 h-[calc(100vh-72px-2rem)] pb-16">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(285px,_1fr))] gap-4">
          {quizItems.map((q, index) => (
            <AnswersItem key={index} quizItem={q} index={index + 1} />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}

export default AnswersPage
