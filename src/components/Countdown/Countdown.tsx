import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import styles from './Countdown.module.css';

const Countdown = () => {
	const {
		timeLeft,
		isCountdown
	} = useBoundStore(
		useShallow((state) => ({
			timeLeft: state.timeLeft,
			isCountdown: state.isCountdown
		}))
	);
	const counter = timeLeft === 5 ? timeLeft - 2 : timeLeft === 1 ? 'GO!' : timeLeft - 1;

	return (
		<div className={`${styles.countdown} ${isCountdown ? styles.active : ''}`} style={{'--counter': `${counter}`} as React.CSSProperties}>
			<div className={styles.countdownValue}>{counter}</div>
		</div>
	);
}

export default Countdown;
