import Skeleton from '../Skeleton/Skeleton';
import stylesQuiz from '../Quiz/Quiz.module.css';
import stylesQuestion from '../Question/Question.module.css';
import styles from './QuizSkeleton.module.css';

const QuizSkeleton = () => {
	return (
		<div className={`${stylesQuiz.quiz} ${styles.skeleton}`}>
			<div className={`${stylesQuestion.question} ${styles.question}`}>
				<div className={stylesQuestion.questionNumber}>
					<Skeleton width="1.5em" height="2em" />
				</div>
				<h2 className={`${stylesQuestion.questionTitle} ${styles.questionTitle}`}>
					<Skeleton width="100%" height="1em" />
					<Skeleton width="100%" height="1em" />
				</h2>
				<div className={stylesQuestion.answers}>
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className={`${stylesQuestion.answer} ${styles.answer}`}>
							<Skeleton width="100%" height="1em" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default QuizSkeleton;
