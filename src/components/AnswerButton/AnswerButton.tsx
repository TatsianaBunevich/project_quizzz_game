import Button from '../Button/Button'
import styles from './AnswerButton.module.css'

const AnswerButton = ({
  onClick,
  children,
  className,
  ...rest
}: React.ComponentProps<'button'>) => {
  return (
    <Button
      className={`${styles.answerButton} ${className ?? ''}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default AnswerButton
