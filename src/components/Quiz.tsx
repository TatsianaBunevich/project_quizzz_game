import React, { useState } from 'react';
import Question from './Question';
import styles from './Quiz.module.css';

const Quiz: React.FC = () => {
	const questions = [
		{ id: 1, question: 'How would one say goodbye in Spanish?', answers: ['Adiós', 'Hola', 'Au Revoir', 'Salir'], correct: 'Adiós' },
		{ id: 2, question: 'Which best selling toy of 1983 caused hysteria, resulting in riots breaking in stores?', answers: ['Cabbage Patch Kids', 'Transformers', 'Care Bears', 'Rubik’s Cube'], correct: 'Cabbage Patch Kids' },
		{ id: 3, question: 'What is the hottest planet in our Solar System?', answers: ['Mercury', 'Venus', 'Mars', 'Saturn'], correct: 'Venus' },
		{ id: 4, question: 'In which country was the caesar salad invented?', answers: ['Italy', 'Portugal', 'Mexico', 'France'], correct: 'Mexico' },
		{ id: 5, question: 'How Many Hearts Does An Octopus Have?', answers: ['One', 'Two', 'Three', 'Four'], correct: 'Three' },
	];

	const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

	const handleAnswerSelect = (questionId: number, answer: string) => {
		setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
	};

	return (
		<main className={styles.quiz}>
			{questions.map((q) => (
				<Question key={q.id} question={q} selectedAnswer={selectedAnswers[q.id]} onSelectAnswer={handleAnswerSelect} />
			))}
		</main>
	);
};

export default Quiz;
