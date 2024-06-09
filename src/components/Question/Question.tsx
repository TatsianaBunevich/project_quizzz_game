import styles from './Question.module.css';
import { SelectedAnswer, Answer } from '../../types';
import { sortedQuestionsType } from '../../types';
import { useContext } from 'react';
import { QuestionsContext } from '../../context/questionsContext';

type QuestionProps = {
    quizItem: sortedQuestionsType;
    selectedAnswer: SelectedAnswer | undefined;
    onSelectAnswer: (questionId: string, answer: Answer) => void;
}

const Question = ({ quizItem, selectedAnswer, onSelectAnswer }: QuestionProps) => {
	const { isAnswersShown } = useContext(QuestionsContext);

	const decodeHtmlEntities = (text: string) => {
		const parser = new DOMParser();
		const decodedString = parser.parseFromString(text, 'text/html').body.textContent;

		return decodedString;
	};

	const selectAnswers = (selectedAnswer: SelectedAnswer | undefined, answer: string) => {
		return selectedAnswer?.answer === answer ? styles.selected : '';
	};

	const showAnswers = (selectedAnswer: SelectedAnswer | undefined) => {
		return quizItem.answers.reduce((acc: { [key: string]: string }, item) => {
			if (item.isCorrect) {
				acc[item.answer] = styles.correct;
			} else if (item.answer === selectedAnswer?.answer && !item.isCorrect) {
				acc[item.answer] = styles.incorrect;
			} else {
				acc[item.answer] = '';
			}
			return acc;
		}, {});
	};

	const answerClasses = isAnswersShown ? showAnswers(selectedAnswer) : {};

	return (
		<div className={styles.question}>
			<h2>{decodeHtmlEntities(quizItem.question)}</h2>
			<div className={styles.answers}>
				{quizItem.answers.map((a) => (
					<button
						key={a.answer}
						disabled={isAnswersShown}
						className={`${selectAnswers(selectedAnswer, a.answer)} ${answerClasses[a.answer] || ''}`}
						onClick={() => onSelectAnswer(quizItem.question, a)}
					>
						{decodeHtmlEntities(a.answer)}
					</button>
				))}
			</div>
		</div>
	);
};

export default Question;
