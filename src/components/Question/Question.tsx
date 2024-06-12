import styles from './Question.module.css';
import { SelectedAnswer, Answer } from '../../types';
import { sortedQuestionsType } from '../../types';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';

type QuestionProps = {
    quizItem: sortedQuestionsType;
	id: number;
    selectedAnswer: SelectedAnswer | undefined;
    onSelectAnswer: (questionId: string, answer: Answer) => void;
}

const Question = ({ quizItem, id, selectedAnswer, onSelectAnswer }: QuestionProps) => {
	const { activeQuestionId, isAnswersShown } = useContext(QuizContext);

	const applyQuestionClasses = () => {
		if (activeQuestionId === id) {
			return styles.active;
		}
		return isAnswersShown ? [styles.active, styles.all].join(' ') : '';
	};

	const decodeHtmlEntities = (text: string) => {
		const parser = new DOMParser();
		const decodedString = parser.parseFromString(text, 'text/html').body.textContent;

		return decodedString;
	};

	const selectAnswers = (selectedAnswer: SelectedAnswer | undefined, answer: string) => {
		return selectedAnswer?.answer === answer ? styles.selected : '';
	};

	const blurUnselectedAnswers = (selectedAnswer: SelectedAnswer | undefined) => {
		return selectedAnswer === undefined ? styles.shown : '';
	};

	const blurClasses = isAnswersShown ? blurUnselectedAnswers(selectedAnswer) : '';

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

	// TODO: styled items when active and on Check

	return (
		<div className={`${styles.question} ${applyQuestionClasses()}`}>
			<h2>{id+1}. {decodeHtmlEntities(quizItem.question)}</h2>
			<div className={styles.answers}>
				<div className={`${styles.blur} ${blurClasses}`}>
					<p>You didn't answer this question</p>
				</div>
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
