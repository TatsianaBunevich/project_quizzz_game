import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useContext, useRef, useEffect } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { ControlsContext } from '../../context/ControlsContext';
import Question from '../Question/Question';
import Modal from '../Modal/Modal';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './Quiz.module.css';

const Quiz = () => {
	const {
		isModalShown,
	} = useContext(QuizContext);

	const {
		sortedQuestions,
		activeQuestionId,
		isAnswersShown
	} = useBoundStore(
		useShallow((state) => ({
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			isAnswersShown: state.isAnswersShown
		}))
	);

	const { handleCheckAnswers, handleOpenSettings, handleCloseModal } = useContext(ControlsContext);
	const progress = useRef<HTMLDivElement>(null);
	const oldLength = useRef(0);
	const newLength = (activeQuestionId ) / (sortedQuestions.length - 1) * 100;

	useEffect(() => {
		if (progress.current) {
			progress.current.style.animation = 'none';
			progress.current.offsetHeight;
			progress.current.style.setProperty("--old-length", `${oldLength.current}%`);
			progress.current.style.setProperty("--new-length", `${newLength}%`);
			progress.current.style.animation = 'progress 0.5s normal forwards';
			oldLength.current = newLength;
		}
	}, [newLength]);

	return (
		<>
			{!isAnswersShown && <div className={styles.quizProgress} ref={progress}></div>}
			<div className={`${styles.quiz} ${isAnswersShown ? styles.allShown : ''}`}>
				{sortedQuestions.map((q, index) => {
					return <Question key={index} quizItem={q} id={index} />
				})}
			</div>
			<Modal isOpen={isModalShown}>
				<h2>Do you want to</h2>
				<SubmitButton className={styles.modalButton} onClick={handleCloseModal}>Back to the game</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleCheckAnswers}>See the result</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleOpenSettings}>Go to settings</SubmitButton>
			</Modal>
		</>
	);
};

export default Quiz;
