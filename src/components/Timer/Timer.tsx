import useBoundStore from '../../store/boundStore';
import { secondsToHms } from '../../helpers';
import styles from './Timer.module.css';

const Timer = () => {
	const timeLeft = useBoundStore((state) => state.timeLeft);
	return <div className={styles.timer}><span>{secondsToHms(timeLeft)}</span></div>;
};

export default Timer;
