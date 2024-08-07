import useBoundStore from '../../store/boundStore';
import { useState, useEffect, useRef } from 'react';
import styles from './Countdown.module.css';

const Countdown = () => {
	const toggleCountdown = useBoundStore((state) => state.toggleCountdown);
	const timer = useRef<HTMLDivElement>(null);
	const [counter, setCounter] = useState(4);

	useEffect(() => {
		if (counter === -1) {
			toggleCountdown();
			return;
		}

		const countdown = setTimeout(() => {
			setCounter(counter => counter - 1);
		}, 1000);

		return () => clearTimeout(countdown);
	}, [counter, toggleCountdown]);

	useEffect(() => {
		if (timer.current) {
			timer.current.style.setProperty("--counter", `${counter}`);
		}
	}, [counter]);

	return (
		<div className={styles.countdown} ref={timer}>
			<div className={styles.countdownValue}>{counter === 4 ? counter - 1 : counter === 0 ? 'GO!' : counter}</div>
		</div>
	);
}

export default Countdown;
