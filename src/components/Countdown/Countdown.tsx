import useBoundStore from '../../store/boundStore';
import styles from './Countdown.module.css';

const Countdown = () => {
	const timeLeft = useBoundStore((state) => state.timeLeft);
	const counter = timeLeft === 4 ? timeLeft - 1 : timeLeft === 0 ? 'GO!' : timeLeft;

	return (
		<div className={styles.countdown} style={{'--counter': `${counter}`} as React.CSSProperties}>
			<div className={styles.countdownValue}>{counter}</div>
		</div>
	);
}

export default Countdown;
