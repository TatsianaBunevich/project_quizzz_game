import { memo } from 'react'
import { Check, X } from 'lucide-react'

interface DisplayedAnswerProps {
  text: string
}

const DisplayedAnswer = ({
  text,
}: DisplayedAnswerProps &
  (React.ComponentProps<'svg'> | React.ComponentProps<'span'>)) => {
  switch (text) {
    case 'True':
      return <Check className="mx-auto" />
    case 'False':
      return <X className="mx-auto" />
    default:
      return (
        <span
          dangerouslySetInnerHTML={{ __html: text }}
          className="mx-auto text-center"
        />
      )
  }
}

memo(DisplayedAnswer).displayName = 'DisplayedAnswer'

export default DisplayedAnswer
