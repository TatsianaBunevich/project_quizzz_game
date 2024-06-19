import { useState, useEffect, useContext, useCallback } from 'react';
import { QuizContext } from '../../context/QuizContext';
import styles from './Scoreboard.module.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Score } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import { secondsToHms } from '../../helpers';

const Scoreboard = () => {
	const { scores } = useContext(QuizContext);
	const [sortedScore, setSortedScore] = useState<Score[]>([]);
	const [sortConfig, setSortConfig] = useState<{ key: keyof Score, ascending: boolean }>({ key: 'index', ascending: true });

	const scoresCallback = useCallback(() => {
		const key = sortConfig.key;
		const sorted = [...scores].sort((a, b) => {
			if (a[key] < b[key]) return sortConfig.ascending ? -1 : 1;
			if (a[key] > b[key]) return sortConfig.ascending ? 1 : -1;
			return 0;
		});
		setSortedScore(sorted);
	}, [scores, sortConfig.key, sortConfig.ascending]);

	useEffect(() => {
		scoresCallback();
	}, [scoresCallback]);

	const updateSortConfig = (key: keyof Score) => {
		setSortConfig({ key, ascending: !sortConfig.ascending });
	}

	return (
		<div className={styles.table}>
			<div className={`${styles.tableRow} ${styles.tableHeader}`}>
				<div onClick={() => updateSortConfig('index')}>
					{sortConfig.key === 'index' && <FontAwesomeIcon className={styles.sortIcon} icon={sortConfig.ascending ? faArrowDownShortWide : faArrowDownWideShort} />}
				</div>
				<div onClick={() => updateSortConfig('total')}>
					Score
					{sortConfig.key === 'total' && <FontAwesomeIcon className={styles.sortIcon} icon={sortConfig.ascending ? faArrowDownShortWide : faArrowDownWideShort} />}
				</div>
				<div onClick={() => updateSortConfig('time')}>
					Time
					{sortConfig.key === 'time' && <FontAwesomeIcon className={styles.sortIcon} icon={sortConfig.ascending ? faArrowDownShortWide : faArrowDownWideShort} />}
				</div>
			</div>
			{sortedScore.map((score, index) => (
				<div key={index} className={styles.tableRow}>
					<div>{score.index}</div>
					<div>
						<ProgressBar score={score.total} status={score.status} />
					</div>
					<div>{score.time > 0 && secondsToHms(score.time)}</div>
				</div>
			))}
		</div>
	);
};

export default Scoreboard;