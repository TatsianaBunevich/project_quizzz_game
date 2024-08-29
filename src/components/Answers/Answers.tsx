import { Answer } from '../../types';
import { QuizState } from '../../store/types';
import Question from '../Question/Question';
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
					<Question key={index} className={styles.question}>
						<Question.Title title={q.question} className={styles.questionTitle} />
						<Question.Options className={styles.options}>
							{q.answers.every(a => !a.isSelected) && <Question.Blur />}
							{q.answers.map((a) => (
								<div
									key={a.answer}
									className={`${stylesAnswerButton.answerButton} ${styles.option} ${answerClasses(a)}`}
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
