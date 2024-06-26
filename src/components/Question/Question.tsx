import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import QuestionTimer from '../QuestionTimer/QuestionTimer';
import Button from '../Button/Button';
import { sortedQuestionsType, SelectedAnswer, Answer } from '../../types';
import styles from './Question.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

type QuestionProps = {
    quizItem: sortedQuestionsType;
	id: number;
    selectedAnswer: SelectedAnswer | undefined;
    onSelectAnswer: (questionId: string, answer: Answer) => void;
}

const Question = ({ quizItem, id, selectedAnswer, onSelectAnswer }: QuestionProps) => {
	const { activeQuestionId, isAnswersShown } = useContext(QuizContext);
	const isActive = activeQuestionId === id && !isAnswersShown;

	const questionClasses = () => {
		if (isActive) {
			return styles.active;
		}
		return isAnswersShown ? [styles.active, styles.allShown].join(' ') : '';
	};

	const decodeHtmlEntities = (text: string) => {
		const parser = new DOMParser();
		const decodedString = parser.parseFromString(text, 'text/html').body.textContent;

		return decodedString;
	};

	const displayAnswer = (text: string) => {
		switch (text) {
			case 'True':
				return <FontAwesomeIcon className={`${styles.boolean} ${styles.true}`} icon={faCheck} />;
			case 'False':
				return <FontAwesomeIcon className={`${styles.boolean} ${styles.false}`} icon={faXmark} />;
			default:
				return decodeHtmlEntities(text);
		}
	}

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

	return (
		<div className={`${styles.question} ${questionClasses()}`}>
			{quizItem.timer > 0 && isActive && <QuestionTimer timer={quizItem.timer} />}
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
						{displayAnswer(a.answer)}
					</Button>
				))}
			</div>
		</div>
	);
};

export default Question;
