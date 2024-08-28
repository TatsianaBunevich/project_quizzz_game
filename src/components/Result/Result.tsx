import useBoundStore from '../../store/boundStore';
import { useState } from 'react';
import { Status } from '../../types';
import styles from './Result.module.css';
import { secondsToHms } from '../../helpers';

const Result = () => {
	const sortedQuestions = useBoundStore((state) => state.sortedQuestions);
	const score = useBoundStore((state) => state.scores[state.scores.length - 1]);
	const [result, setResult] = useState(true);
	const statusClass = score.status === Status.GOOD ? styles.good : score.status === Status.NORMAL ? styles.normal : styles.bad;

	const handleSwitchResult = () => {
		setResult(!result);
	}

	return (
		<div className={styles.result} style={{'--score': `${score.percentage}`} as React.CSSProperties}>
			<svg className={styles.circularProgress} onClick={handleSwitchResult}>
				<circle className={styles.background}></circle>
				<circle className={`${styles.foreground} ${statusClass}`}></circle>
				<text x="50%" y="50%" textAnchor="middle" className={styles.circularProgressValue} dy=".3em">
					<tspan x="50%" className={`${styles.text} ${result ? styles.show : ''}`}>{`${score.percentage}%`}</tspan>
					<tspan x="50%" className={`${styles.text} ${!result ? styles.show : ''}`}>{`${score.points}/${sortedQuestions.length}`}</tspan>
				</text>
			</svg>
			<div className={styles.time}>{score.time > 0 && secondsToHms(score.time)}</div>
		</div>
	);
};

export default Result;
