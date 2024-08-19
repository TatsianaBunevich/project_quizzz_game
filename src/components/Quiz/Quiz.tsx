import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useRef, useEffect } from 'react';
import { OptionalSelectedAnswer } from '../../types';
import QuestionTimer from '../QuestionTimer/QuestionTimer';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import Modal from '../Modal/Modal';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './Quiz.module.css';

const Quiz = () => {
	const {
		timer,
		sortedQuestions,
		selectedAnswers,
		activeQuestionId,
		handleSelectAnswer,
		handleCheckAnswers,
		handleOpenSettings,
		handleCloseModal
	} = useBoundStore(
		useShallow((state) => ({
			timer: state.settings.timer,
			sortedQuestions: state.sortedQuestions,
			selectedAnswers: state.selectedAnswers,
			activeQuestionId: state.activeQuestionId,
			handleSelectAnswer: state.handleSelectAnswer,
			handleCheckAnswers: state.handleCheckAnswers,
			handleOpenSettings: state.handleOpenSettings,
			handleCloseModal: state.handleCloseModal
		}))
	);
	const selectedAnswer: OptionalSelectedAnswer = selectedAnswers.find(item => item?.question === sortedQuestions[activeQuestionId].question);
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
			<div className={styles.quiz}>
				<Question>
					<Question.Id id={activeQuestionId} />
					<Question.Title title={sortedQuestions[activeQuestionId].question} />
					<Question.Options>
						{sortedQuestions[activeQuestionId].answers.map((a) => (
							<AnswerButton
								key={a.answer}
								className={selectedAnswer?.answer === a.answer ? styles.selected : ''}
								onClick={() => handleSelectAnswer(sortedQuestions[activeQuestionId].question, a)}
							>
								<DisplayedAnswer text={a.answer} />
							</AnswerButton>
						))}
					</Question.Options>
				</Question>
			</div>
			<div className={styles.quizProgress} ref={progress}></div>
			{timer > 0 && <QuestionTimer />}
			<Modal>
				<h2>Do you want to</h2>
				<SubmitButton className={styles.modalButton} onClick={handleCloseModal}>Back to the game</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleCheckAnswers}>See the result</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleOpenSettings}>Go to settings</SubmitButton>
			</Modal>
		</>
	);
};

export default Quiz;
