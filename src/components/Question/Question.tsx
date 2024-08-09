import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import Button from '../Button/Button';
import { sortedQuestionsType, SelectedAnswer } from '../../types';
import styles from './Question.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

type OptionalSelectedAnswer = SelectedAnswer | undefined;

interface QuestionProps {
    quizItem: sortedQuestionsType;
	id: number;
}

const Question = ({ quizItem, id }: QuestionProps) => {
	const {
		handleSelectAnswer,
		selectedAnswers,
		isAnswersShown
	} = useBoundStore(
		useShallow((state) => ({
			handleSelectAnswer: state.handleSelectAnswer,
			selectedAnswers: state.selectedAnswers,
			isAnswersShown: state.isAnswersShown
		}))
	);

	const selectedAnswer: OptionalSelectedAnswer = selectedAnswers.find(item => item?.question === quizItem.question);

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

	const selectAnswers = (selectedAnswer: OptionalSelectedAnswer, answer: string) => {
		return selectedAnswer?.answer === answer ? styles.selected : '';
	};

	const blurUnselectedAnswers = (selectedAnswer: OptionalSelectedAnswer) => {
		return selectedAnswer === undefined ? styles.shown : '';
	};

	const blurClasses = isAnswersShown ? blurUnselectedAnswers(selectedAnswer) : '';

	const showAnswers = (selectedAnswer: OptionalSelectedAnswer) => {
		return quizItem.answers.reduce((acc: Record<string, string>, item) => {
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
		<div className={`${styles.question} ${isAnswersShown ? styles.allShown : ''}`}>
			<div className={styles.questionNumber}>{id+1}</div>
			<h2 className={styles.questionTitle}>
				<span className={styles.questionShownNumber}>{id+1}</span>
				{decodeHtmlEntities(quizItem.question)}
			</h2>
			<div className={styles.answers}>
				<div className={`${styles.blur} ${blurClasses}`}>
					<p>You didn&apos;t answer this question</p>
				</div>
				{quizItem.answers.map((a) => (
					<Button
						key={a.answer}
						disabled={isAnswersShown}
						className={`${styles.answer} ${selectAnswers(selectedAnswer, a.answer)} ${answerClasses[a.answer] || ''}`}
						onClick={() => handleSelectAnswer(quizItem.question, a)}
					>
						{displayAnswer(a.answer)}
					</Button>
				))}
			</div>
		</div>
	);
};

export default Question;
