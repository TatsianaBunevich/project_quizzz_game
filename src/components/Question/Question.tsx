import { memo } from 'react';
import styles from './Question.module.css';

const Question = ({ children, className }: React.ComponentProps<'div'>) => {
	return (
		<div className={`${styles.question} ${className ?? ''}`}>
			{children}
		</div>
	);
};

const Id = ({ id }: { id: number }) => <div className={styles.questionId}>{id+1}</div>;

const Title = ({ title, className }: React.ComponentProps<'h2'> & { title: string }) => <h2 className={`${styles.questionTitle} ${className ?? ''}`} dangerouslySetInnerHTML={{__html: title}} />;

const Options = ({ children, className }: React.ComponentProps<'div'>) => {
	return (
		<div className={`${styles.answers} ${className ?? ''}`}>
			{children}
		</div>
	);
};

const Blur = () => {
	return (
		<div className={styles.blur}>
			<p>You didn&apos;t answer this question</p>
		</div>
	)
};

Question.Id = memo(Id);
Question.Title = memo(Title);
Question.Options = Options;
Question.Blur = Blur;

export default Question;
