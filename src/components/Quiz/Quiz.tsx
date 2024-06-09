import Question from '../Question/Question';
import styles from './Quiz.module.css';
import { useContext } from 'react';
import { QuestionsContext } from '../../context/questionsContext';

const Quiz = () => {
	const { sortedQuestions, selectedAnswers, handleSelectAnswer } = useContext(QuestionsContext);

	return (
		<div className={styles.quiz}>
			{sortedQuestions.map((q, index) => {
				return <Question
					key={index}
					quizItem={q}
					selectedAnswer={selectedAnswers.find(item => item.question === q.question)}
					onSelectAnswer={handleSelectAnswer}
				/>
			})}
		</div>
	);
};

export default Quiz;
