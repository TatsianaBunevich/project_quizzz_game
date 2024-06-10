import { useState, useEffect, useContext, useCallback } from 'react';
import { QuestionsContext } from '../../context/questionsContext';
import styles from './History.module.css';
import { Score } from '../../types';

const History = () => {
	const { score } = useContext(QuestionsContext);
	const [sortedScore, setSortedScore] = useState<Score[]>([]);
	const [sortConfig, setSortConfig] = useState<{ key: keyof Score, ascending: boolean }>({ key: 'timestamp', ascending: true });

	const updateSortConfig = (key: keyof Score) => {
		setSortConfig({ key, ascending: !sortConfig.ascending });
	}

	const scoreCallback = useCallback(() => {
		const key = sortConfig.key;
		const sorted = [...score].sort((a, b) => {
			if (key === 'timestamp') {
				const dateA = new Date(a.timestamp).getTime();
				const dateB = new Date(b.timestamp).getTime();
				return sortConfig.ascending ? dateA - dateB : dateB - dateA;
			} else {
				if (a[key] < b[key]) return sortConfig.ascending ? -1 : 1;
				if (a[key] > b[key]) return sortConfig.ascending ? 1 : -1;
				return 0;
			}
		});
		setSortedScore(sorted);
	}, [score, sortConfig.key, sortConfig.ascending]);

	useEffect(() => {
		scoreCallback();
	}, [scoreCallback]);

	return (
		<table className={styles.table}>
			<thead className={styles.tableHead}>
				<tr className={styles.tableRow}>
					<th className={styles.tableHeader} onClick={() => updateSortConfig('score')}>Score</th>
					<th className={styles.tableHeader} onClick={() => updateSortConfig('timestamp')}>Time</th>
				</tr>
			</thead>
			<tbody>
				{sortedScore.map((score, index) => (
					<tr key={index} className={styles.tableRow}>
						<td className={`${styles.tableCell} ${score.win ? styles.win : styles.lose}`}>
							<span>{score.score}/{score.questions}</span>
						</td>
						<td className={styles.tableCell}>{new Date(score.timestamp).toLocaleTimeString()}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default History;