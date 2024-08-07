import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useState, useEffect } from 'react';
import { sortedQuestionsType } from '../../types';
import { secondsToHms } from '../../helpers';
import styles from './QuestionTimer.module.css';

const QuestionTimer = ({ timer }: { timer: sortedQuestionsType['timer'] }) => {
	const {
		incRoundTimeCounter,
		isModal,
		handleNextButton
	} = useBoundStore(
		useShallow((state) => ({
			incRoundTimeCounter: state.incRoundTimeCounter,
			isModal: state.isModal,
			handleNextButton: state.handleNextButton
		}))
	);
	const [timerCounter, setTimerCounter] = useState(timer);

	useEffect(() => {
		if (timerCounter === 0) {
			handleNextButton();
			return;
		}

		const timer = setTimeout(() => {
			setTimerCounter(timerCounter => timerCounter - 1);
			incRoundTimeCounter();
		}, 1000);

		if (isModal) clearTimeout(timer);
		return () => clearTimeout(timer);
	}, [
		incRoundTimeCounter,
		timerCounter,
		handleNextButton,
		isModal
	]);

	return <div className={styles.questionTimer}><span>{secondsToHms(timerCounter)}</span></div>;
};

export default QuestionTimer;
