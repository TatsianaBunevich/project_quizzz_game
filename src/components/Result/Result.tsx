import { useContext, useEffect, useRef, useState } from 'react';
import { QuizContext } from '../../context/QuizContext';
import styles from './Result.module.css';
import { Status } from '../../types';

const Result = () => {
	const { roundScore, calculatedScore, sortedQuestions, roundStatus } = useContext(QuizContext);
	const progress = useRef<HTMLDivElement>(null);
	const [result, setResult] = useState(true);
	const statusClass = roundStatus === Status.GOOD ? styles.good : roundStatus === Status.NORMAL ? styles.normal : styles.bad;
	// TODO: check gap here and on scoreboard
	useEffect(() => {
		if (progress.current) {
			progress.current.style.setProperty("--score", `${roundScore}`);
		}
	}, [roundScore]);

	const switchResult = () => {
		setResult(!result);
	}
	// TODO: set animation on switchResult?
	return (
		<div className={`${styles.result}`} ref={progress}>
			<svg className={`${styles.circularProgress}`} onClick={switchResult}>
				<circle className={`${styles.background}`}></circle>
				<circle className={`${styles.foreground} ${statusClass}`}></circle>
				<text x="50%" y="50%" textAnchor="middle" className={`${styles.circularProgressValue}`} dy=".3em">
					{result ? `${roundScore}%` : `${calculatedScore}/${sortedQuestions.length}`}
				</text>
			</svg>
		</div>
	);
};

export default Result;