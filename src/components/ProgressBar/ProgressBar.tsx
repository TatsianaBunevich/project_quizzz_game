import styles from './ProgressBar.module.css'
import { Status } from '../../types'

interface ProgressBarProps {
  score: number
  status: Status
}

const ProgressBar = ({ score, status }: ProgressBarProps) => {
  const statusClass =
    status === Status.GOOD
      ? styles.good
      : status === Status.NORMAL
        ? styles.normal
        : styles.bad

  return (
    <div
      className={styles.progress}
      style={{ '--score': `${score}%` } as React.CSSProperties}
    >
      <div className={`${styles.progressBar} ${statusClass}`}>
        <div className={`${styles.progressBarValue}`}>{`${score}%`}</div>
      </div>
    </div>
  )
}

export default ProgressBar
