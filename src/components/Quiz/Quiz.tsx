import { useContext, useRef, useEffect } from 'react';
import { GameContext } from '../../context/GameContext';
import { QuizContext } from '../../context/QuizContext';
import Countdown from '../Countdown/Countdown';
import QuestionSkeleton from '../QuestionSkeleton/QuestionSkeleton';
import Question from '../Question/Question';
import Modal from '../Modal/Modal';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './Quiz.module.css';

type QuizProps = {
	setPage: (page: string) => void;
};

const Quiz = ({ setPage }: QuizProps) => {
	const { isLoading } = useContext(GameContext);
	const {
		sortedQuestions,
		activeQuestionId,
		isCountdown,
		setIsCountdown,
		selectedAnswers,
		handleSelectAnswer,
		isModalShown,
		setIsModalShown,
		isAnswersShown,
		clearQuizState,
		calculateScore
	} = useContext(QuizContext);
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

	const handleResult = () => {
		setIsModalShown(false);
		calculateScore();
		setPage('result');
	};

	const handleSettings = () => {
		setIsModalShown(false);
		clearQuizState();
		setPage('settings');
	};

	if (isCountdown) {
		return <Countdown setIsCountdown={setIsCountdown} />;
	} else if (isLoading) {
		return (
			<div className={styles.quiz}>
				<QuestionSkeleton />
			</div>
		)
	}

	return (
		<>
			{!isAnswersShown && <div className={styles.quizProgress} ref={progress}></div>}
			<div className={`${styles.quiz} ${isAnswersShown ? styles.allShown : ''}`}>
				{sortedQuestions.map((q, index) => {
					return <Question
						key={index}
						quizItem={q}
						id={index}
						selectedAnswer={selectedAnswers.find(item => item.question === q.question)}
						onSelectAnswer={handleSelectAnswer}
					/>
				})}
			</div>
			<Modal isOpen={isModalShown}>
				<h2>Do you want to</h2>
				<SubmitButton className={styles.modalButton} onClick={() => setIsModalShown(false)}>Back to the game</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleResult}>See the result</SubmitButton>
				<SubmitButton className={styles.modalButton} onClick={handleSettings}>Go to settings</SubmitButton>
			</Modal>
		</>
	);
};

export default Quiz;
