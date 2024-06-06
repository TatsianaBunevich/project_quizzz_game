import React from 'react';
import styles from './Question.module.css';

interface QuestionProps {
  question: {
    id: number;
    question: string;
    answers: string[];
    correct: string;
  };
  selectedAnswer: string | undefined;
  onSelectAnswer: (questionId: number, answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, selectedAnswer, onSelectAnswer }) => {
	return (
		<div className={styles.question}>
			<h2>{question.question}</h2>
			<div className={styles.answers}>
				{question.answers.map((answer) => (
					<button
						key={answer}
						className={`${styles.answer} ${selectedAnswer === answer ? styles.selected : ''}`}
						onClick={() => onSelectAnswer(question.id, answer)}
					>
						{answer}
					</button>
				))}
			</div>
		</div>
	);
};

export default Question;
