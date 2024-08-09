import useBoundStore from '../../store/boundStore';
import { secondsToHms } from '../../helpers';
import styles from './QuestionTimer.module.css';

const QuestionTimer = () => {
	const timeLeft = useBoundStore((state) => state.timeLeft);
	return <div className={styles.questionTimer}><span>{secondsToHms(timeLeft)}</span></div>;
};

export default QuestionTimer;
