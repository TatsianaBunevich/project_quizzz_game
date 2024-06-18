import Skeleton from '../Skeleton/Skeleton';
import styles from './QuestionSkeleton.module.css';

const QuestionSkeleton = () => {
	return (
		<div className={styles.question}>
			<div className={styles.questionNumber}>
				<Skeleton width="2em" height="3em" />
			</div>
			<h2 className={styles.questionTitle}>
				<Skeleton width="100%" height="1em" />
				<Skeleton width="100%" height="1em" />
			</h2>
			<div className={styles.answers}>
				{[...Array(4)].map((_, index) => (
					<div key={index} className={styles.answer}>
						<Skeleton width="100%" height="1em" />
					</div>
				))}
			</div>
		</div>
	);
};

export default QuestionSkeleton;