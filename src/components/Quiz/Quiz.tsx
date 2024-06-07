import React, { useState } from 'react';
import Question from '../Question/Question';
import styles from './Quiz.module.css';
import { QuizProps, SelectedAnswers, SelectedAnswer } from '../../types';

const Quiz: React.FC<QuizProps> = ({ questions }) => {

	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

	const handleAnswerSelect = (questionId: string, answer: SelectedAnswer) => {
		if (selectedAnswers[questionId] === answer) {
			setSelectedAnswers({});
		} else {
			setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
		}
	};

	return (
		<main className={styles.quiz}>
			{questions.map((q, index) => {
				q.answers = [q.correct_answer, ...q.incorrect_answers];
				return <Question key={index} question={q} selectedAnswer={selectedAnswers[q.question]} onSelectAnswer={handleAnswerSelect} />
			})}
		</main>
	);
};

export default Quiz;
