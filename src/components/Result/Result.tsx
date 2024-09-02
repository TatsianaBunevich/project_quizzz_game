import { useState } from 'react'
import { Status, Score } from '../../types'
import styles from './Result.module.css'
import { secondsToHms } from '../../helpers'

interface ResultProps {
  goal: number
  score: Score
}

const Result = ({ goal, score }: ResultProps) => {
  const [result, setResult] = useState(true)
  const statusClass =
    score.status === Status.GOOD
      ? styles.good
      : score.status === Status.NORMAL
        ? styles.normal
        : styles.bad

  const handleSwitchResult = () => {
    setResult(!result)
  }

  return (
    <div
      className={styles.result}
      style={{ '--score': `${score.percentage}` } as React.CSSProperties}
    >
      <svg className={styles.circularProgress} onClick={handleSwitchResult}>
        <circle className={styles.background}></circle>
        <circle className={`${styles.foreground} ${statusClass}`}></circle>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          className={styles.circularProgressValue}
          dy=".3em"
        >
          <tspan
            x="50%"
            className={`${styles.text} ${result ? styles.show : ''}`}
          >{`${score.percentage}%`}</tspan>
          <tspan
            x="50%"
            className={`${styles.text} ${!result ? styles.show : ''}`}
          >{`${score.points}/${goal}`}</tspan>
        </text>
      </svg>
      <div className={styles.time}>
        {score.time > 0 && secondsToHms(score.time)}
      </div>
    </div>
  )
}

export default Result
