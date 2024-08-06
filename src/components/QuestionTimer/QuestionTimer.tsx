import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useContext, useState, useEffect } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { ControlsContext } from '../../context/ControlsContext';
import { sortedQuestionsType } from '../../types';
import { secondsToHms } from '../../helpers';
import styles from './QuestionTimer.module.css';

const QuestionTimer = ({ timer }: { timer: sortedQuestionsType['timer'] }) => {
	const { isModalShown } = useContext(QuizContext);
	const {
		incRoundTimeCounter
	} = useBoundStore(
		useShallow((state) => ({
			incRoundTimeCounter: state.incRoundTimeCounter
		}))
	);
	const { handleNextButton } = useContext(ControlsContext);
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

		if (isModalShown) clearTimeout(timer);

		return () => clearTimeout(timer);
	}, [
		incRoundTimeCounter,
		timerCounter,
		handleNextButton,
		isModalShown
	]);

	return <div className={styles.questionTimer}><span>{secondsToHms(timerCounter)}</span></div>;
};

export default QuestionTimer;
