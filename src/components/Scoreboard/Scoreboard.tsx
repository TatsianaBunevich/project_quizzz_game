import { useState, useEffect } from 'react'
import styles from './Scoreboard.module.css'
import ProgressBar from '../ProgressBar/ProgressBar'
import { Score } from '../../types'
import { ScoresState } from '../../store/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDownShortWide,
  faArrowDownWideShort,
} from '@fortawesome/free-solid-svg-icons'
import { secondsToHms } from '../../helpers'

const Scoreboard = ({ scores }: ScoresState) => {
  const [sortedScore, setSortedScore] = useState<Score[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Score
    ascending: boolean
  }>({ key: 'index', ascending: true })

  useEffect(() => {
    const key = sortConfig.key
    const sorted = [...scores].sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.ascending ? -1 : 1
      if (a[key] > b[key]) return sortConfig.ascending ? 1 : -1
      return 0
    })
    setSortedScore(sorted)
  }, [scores, sortConfig.key, sortConfig.ascending])

  const updateSortConfig = (key: keyof Score) => {
    setSortConfig({ key, ascending: !sortConfig.ascending })
  }

  return (
    <div className={styles.table}>
      <div className={`${styles.tableRow} ${styles.tableHeader}`}>
        <div onClick={() => updateSortConfig('index')}>
          {sortConfig.key === 'index' && (
            <FontAwesomeIcon
              className={styles.sortIcon}
              icon={
                sortConfig.ascending
                  ? faArrowDownShortWide
                  : faArrowDownWideShort
              }
            />
          )}
        </div>
        <div onClick={() => updateSortConfig('percentage')}>
          Score
          {sortConfig.key === 'percentage' && (
            <FontAwesomeIcon
              className={styles.sortIcon}
              icon={
                sortConfig.ascending
                  ? faArrowDownShortWide
                  : faArrowDownWideShort
              }
            />
          )}
        </div>
        <div onClick={() => updateSortConfig('time')}>
          Time
          {sortConfig.key === 'time' && (
            <FontAwesomeIcon
              className={styles.sortIcon}
              icon={
                sortConfig.ascending
                  ? faArrowDownShortWide
                  : faArrowDownWideShort
              }
            />
          )}
        </div>
      </div>
      {sortedScore.map((score, index) => (
        <div key={index} className={styles.tableRow}>
          <div>{score.index}</div>
          <div>
            <ProgressBar score={score.percentage} status={score.status} />
          </div>
          <div>{score.time > 0 && secondsToHms(score.time)}</div>
        </div>
      ))}
    </div>
  )
}

export default Scoreboard
