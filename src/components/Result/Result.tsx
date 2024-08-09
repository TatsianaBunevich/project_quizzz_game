import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useState } from 'react';
import { Status } from '../../types';
import styles from './Result.module.css';
import { secondsToHms } from '../../helpers';

const Result = () => {
	const {
		sortedQuestions,
		calculatedScore,
		roundScore,
		roundStatus,
		roundTimeCounter
	} = useBoundStore(
		useShallow((state) => ({
			sortedQuestions: state.sortedQuestions,
			calculatedScore: state.calculatedScore,
			roundScore: state.roundScore,
			roundStatus: state.roundStatus,
			roundTimeCounter: state.roundTimeCounter
		}))
	);
	const [result, setResult] = useState(true);
	const statusClass = roundStatus === Status.GOOD ? styles.good : roundStatus === Status.NORMAL ? styles.normal : styles.bad;

	const handleSwitchResult = () => {
		setResult(!result);
	}

	return (
		<div className={styles.result} style={{'--score': `${roundScore}`} as React.CSSProperties}>
			<svg className={styles.circularProgress} onClick={handleSwitchResult}>
				<circle className={styles.background}></circle>
				<circle className={`${styles.foreground} ${statusClass}`}></circle>
				<text x="50%" y="50%" textAnchor="middle" className={styles.circularProgressValue} dy=".3em">
					<tspan x="50%" className={`${styles.text} ${result ? styles.show : ''}`}>{`${roundScore}%`}</tspan>
					<tspan x="50%" className={`${styles.text} ${!result ? styles.show : ''}`}>{`${calculatedScore}/${sortedQuestions.length}`}</tspan>
				</text>
			</svg>
			<div className={styles.roundTimeCounter}>{roundTimeCounter > 0 && secondsToHms(roundTimeCounter)}</div>
		</div>
	);
};

export default Result;
