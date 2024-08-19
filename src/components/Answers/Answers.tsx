import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { OptionalSelectedAnswer, Answer } from '../../types';
import Question from '../Question/Question';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import stylesAnswerButton from '../AnswerButton/AnswerButton.module.css';
import styles from './Answers.module.css';

const Answers = () => {
	const {
		sortedQuestions,
		selectedAnswers
	} = useBoundStore(
		useShallow((state) => ({
			sortedQuestions: state.sortedQuestions,
			selectedAnswers: state.selectedAnswers
		}))
	);

	const answerClasses = (selectedAnswer: OptionalSelectedAnswer, a: Answer) => {
		if (a.isCorrect) {
			return styles.correct;
		} else if (selectedAnswer?.answer === a.answer && !a.isCorrect) {
			return styles.incorrect;
		} else {
			return '';
		}
	};

	return (
		<div className={styles.answers}>
			{sortedQuestions.map((q, index) => {
				const selectedAnswer: OptionalSelectedAnswer = selectedAnswers.find(item => item?.question === q.question);

				return (
					<Question key={index} className={styles.question}>
						<Question.Title title={q.question} className={styles.questionTitle} />
						<Question.Options className={styles.options}>
							{selectedAnswer === undefined && <Question.Blur />}
							{q.answers.map((a) => (
								<div
									key={a.answer}
									className={`${stylesAnswerButton.answerButton} ${styles.option} ${answerClasses(selectedAnswer, a)}`}
								>
									<DisplayedAnswer text={a.answer} className={styles.boolean} />
								</div>
							))}
						</Question.Options>
					</Question>
				)
			})}
		</div>
	);
};

export default Answers;
