import styles from './Question.module.css';
import { sortedQuestionsType, SelectedAnswer, Answer } from '../../types';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import Button from '../Button/Button';

type QuestionProps = {
    quizItem: sortedQuestionsType;
	id: number;
    selectedAnswer: SelectedAnswer | undefined;
    onSelectAnswer: (questionId: string, answer: Answer) => void;
}

const Question = ({ quizItem, id, selectedAnswer, onSelectAnswer }: QuestionProps) => {
	const { activeQuestionId, isAnswersShown } = useContext(QuizContext);

	const questionClasses = () => {
		if (activeQuestionId === id && !isAnswersShown) {
			return styles.active;
		}
		return isAnswersShown ? [styles.active, styles.allShown].join(' ') : '';
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
	// TODO: add number of questions?
	return (
		<div className={`${styles.question} ${questionClasses()}`}>
			<div className={styles.questionNumber}>{id+1}</div>
			<h2 className={styles.questionTitle}>
				<span className={styles.questionShownNumber}>{id+1}</span>
				{decodeHtmlEntities(quizItem.question)}
			</h2>
			<div className={styles.answers}>
				<div className={`${styles.blur} ${blurClasses}`}>
					<p>You didn't answer this question</p>
				</div>
				{quizItem.answers.map((a) => (
					<Button
						key={a.answer}
						disabled={isAnswersShown}
						className={`${styles.answer} ${selectAnswers(selectedAnswer, a.answer)} ${answerClasses[a.answer] || ''}`}
						onClick={() => onSelectAnswer(quizItem.question, a)}
					>
						{decodeHtmlEntities(a.answer)}
					</Button>
				))}
			</div>
		</div>
	);
};

export default Question;
