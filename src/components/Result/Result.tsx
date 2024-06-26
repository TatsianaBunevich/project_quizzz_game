import { useContext, useEffect, useRef, useState } from 'react';
import { Status } from '../../types';
import { QuizContext } from '../../context/QuizContext';
import styles from './Result.module.css';
import { secondsToHms } from '../../helpers';

const Result = () => {
	const { roundScore, calculatedScore, sortedQuestions, roundStatus, roundTimeCounter } = useContext(QuizContext);
	const progress = useRef<HTMLDivElement>(null);
	const [result, setResult] = useState(true);
	const statusClass = roundStatus === Status.GOOD ? styles.good : roundStatus === Status.NORMAL ? styles.normal : styles.bad;

	useEffect(() => {
		if (progress.current) {
			progress.current.style.setProperty("--score", `${roundScore}`);
		}
	}, [roundScore]);

	const handleSwitchResult = () => {
		setResult(!result);
	}

	return (
		<div className={styles.result} ref={progress}>
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