import { memo } from 'react'
import styles from './QuizItem.module.css'

const QuizItem = ({ children, className }: React.ComponentProps<'div'>) => {
  return (
    <div className={`${styles.quizItem} ${className ?? ''}`}>{children}</div>
  )
}

const Id = ({ id }: { id: number }) => <div className={styles.id}>{id + 1}</div>

const Title = ({
  title,
  className,
}: React.ComponentProps<'h2'> & { title: string }) => (
  <h2
    className={`${styles.title} ${className ?? ''}`}
    dangerouslySetInnerHTML={{ __html: title }}
  />
)

const Options = ({ children, className }: React.ComponentProps<'div'>) => {
  return (
    <div className={`${styles.answers} ${className ?? ''}`}>{children}</div>
  )
}

const Blur = () => {
  return (
    <div className={styles.blur}>
      <p>You didn&apos;t answer this question</p>
    </div>
  )
}

QuizItem.Id = memo(Id)
QuizItem.Title = memo(Title)
QuizItem.Options = Options
QuizItem.Blur = Blur

export default QuizItem
