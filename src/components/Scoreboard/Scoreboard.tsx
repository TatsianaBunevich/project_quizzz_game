import { useState, useEffect, useContext, useCallback } from 'react';
import { QuizContext } from '../../context/QuizContext';
import styles from './Scoreboard.module.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Score } from '../../types';

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
					<span className={`${styles.arrow} ${sortConfig.key === 'index' ? (sortConfig.ascending ? styles.down : styles.up) : ''}`}></span>
				</div>
				<div onClick={() => updateSortConfig('total')}>
					Score
					<span className={`${styles.arrow} ${sortConfig.key === 'total' ? (sortConfig.ascending ? styles.up : styles.down) : ''}`}></span>
				</div>
			</div>
			{sortedScore.map((score, index) => (
				<div key={index} className={styles.tableRow}>
					<div>{score.index}</div>
					<div>
						<ProgressBar score={score.total} status={score.status} />
					</div>
				</div>
			))}
		</div>
	);
};

export default Scoreboard;