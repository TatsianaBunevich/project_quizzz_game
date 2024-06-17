import { useState, useEffect, useRef } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ setIsCountdown }: { setIsCountdown: (isCountdown: boolean) => void }) => {
	const timer = useRef<HTMLDivElement>(null);
	const [counter, setCounter] = useState(4);

	useEffect(() => {
		if (counter === -1) {
			setIsCountdown(false);
			return;
		}
		setTimeout(() => {
			setCounter(counter - 1);
		}, 1000);
	}, [counter, setIsCountdown]);

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