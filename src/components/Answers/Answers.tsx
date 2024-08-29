import { Answer } from '../../types';
import { QuizState } from '../../store/types';
import QuizItem from '../QuizItem/QuizItem';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import stylesAnswerButton from '../AnswerButton/AnswerButton.module.css';
import styles from './Answers.module.css';

const Answers = ({ quizItems }: Pick<QuizState, 'quizItems'>) => {
	const answerClasses = (a: Answer) => {
		if (a.isCorrect) {
			return styles.correct;
		} else if (a.isSelected && !a.isCorrect) {
			return styles.incorrect;
		} else {
			return '';
		}
	};

	return (
		<div className={styles.answers}>
			{quizItems.map((q, index) => {
				return (
					<QuizItem key={index} className={styles.quizItem}>
						<QuizItem.Title title={q.question} className={styles.title} />
						<QuizItem.Options className={styles.options}>
							{q.answers.every(a => !a.isSelected) && <QuizItem.Blur />}
							{q.answers.map((a) => (
								<div
									key={a.answer}
									className={`${stylesAnswerButton.answerButton} ${styles.option} ${answerClasses(a)}`}
								>
									<DisplayedAnswer text={a.answer} className={styles.boolean} />
								</div>
							))}
						</QuizItem.Options>
					</QuizItem>
				)
			})}
		</div>
	);
};

export default Answers;
