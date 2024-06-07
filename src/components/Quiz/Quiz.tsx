import React, { useState } from 'react';
import Question from '../Question/Question';
import styles from './Quiz.module.css';
import { Question as QuestionType } from '../../types';

const Quiz: React.FC<{ questions: QuestionType[] }> = ({ questions }) => {

	const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

	const handleAnswerSelect = (questionId: string, answer: string) => {
		setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
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
