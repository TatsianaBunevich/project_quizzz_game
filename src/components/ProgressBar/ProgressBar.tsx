import { useEffect, useRef } from 'react';
import styles from './ProgressBar.module.css';
import { Status } from '../../types';

const ProgressBar = ({ score, status }: { score: number, status: Status }) => {
	const progress = useRef<HTMLDivElement>(null);
	const statusClass = status === Status.GOOD ? styles.good : status === Status.NORMAL ? styles.normal : styles.bad;

	useEffect(() => {
		if (progress.current) {
			progress.current.style.setProperty("--score", `${score}%`);
		}
	}, [score]);

	return (
		<div className={styles.progress} ref={progress}>
			<div className={`${styles.progressBar} ${statusClass}`}>
				<div className={`${styles.progressBarValue}`}>{`${score}%`}</div>
			</div>
		</div>
	);
};

export default ProgressBar;

