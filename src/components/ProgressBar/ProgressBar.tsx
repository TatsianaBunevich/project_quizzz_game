import styles from './ProgressBar.module.css';
import { Status } from '../../types';

const ProgressBar = ({ score, status }: { score: number, status: Status }) => {
	const statusClass = status === Status.GOOD ? styles.good : status === Status.NORMAL ? styles.normal : styles.bad;

	return (
		<div className={styles.progress} style={{'--score': `${score}%`} as React.CSSProperties}>
			<div className={`${styles.progressBar} ${statusClass}`}>
				<div className={`${styles.progressBarValue}`}>{`${score}%`}</div>
			</div>
		</div>
	);
};

export default ProgressBar;

