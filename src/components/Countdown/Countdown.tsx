import useBoundStore from '../../store/boundStore';
import styles from './Countdown.module.css';

const Countdown = () => {
	const timeLeft = useBoundStore((state) => state.timeLeft);
	const counter = timeLeft === 5 ? timeLeft - 2 : timeLeft === 1 ? 'GO!' : timeLeft - 1;

	return (
		<div className={styles.countdown} style={{'--counter': `${counter}`} as React.CSSProperties}>
			<div className={styles.countdownValue}>{counter}</div>
		</div>
	);
}

export default Countdown;
