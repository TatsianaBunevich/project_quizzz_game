import Question from '../Question/Question';
import styles from './Quiz.module.css';
import { useContext, useRef, useEffect } from 'react';
import { QuizContext } from '../../context/QuizContext';

const Quiz = () => {
	const { sortedQuestions, activeQuestionId, selectedAnswers, handleSelectAnswer, isAnswersShown } = useContext(QuizContext);
	const progress = useRef<HTMLDivElement>(null);
	const oldLength = useRef(0);
	const newLength = (activeQuestionId ) / (sortedQuestions.length - 1) * 100;

	useEffect(() => {
		if (progress.current) {
			progress.current.style.animation = 'none';
			progress.current.offsetHeight;
			progress.current.style.setProperty("--old-length", `${oldLength.current}%`);
			progress.current.style.setProperty("--new-length", `${newLength}%`);
			progress.current.style.animation = 'load 0.5s normal forwards';
			oldLength.current = newLength;
		}
	}, [newLength]);

	return (
		<>
			{!isAnswersShown && <div className={styles.quizProgress} ref={progress}></div>}
			<div className={styles.quiz}>
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
		</>
	);
};

export default Quiz;
