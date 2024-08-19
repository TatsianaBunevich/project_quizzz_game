import { memo } from 'react';
import styles from './Question.module.css';

interface QuestionProps extends React.ComponentProps<'div'> {
	children: React.ReactNode;
}

interface TitleProps extends React.ComponentProps<'h2'> {
	title: string;
}

interface OptionsProps extends React.ComponentProps<'div'> {
	children: React.ReactNode;
}

const Question = ({ children, className }: QuestionProps) => {
	return (
		<div className={`${styles.question} ${className ?? ''}`}>
			{children}
		</div>
	);
};

const Id = ({ id }: { id: number }) => <div className={styles.questionId}>{id+1}</div>;

const Title = ({ title, className }: TitleProps) => <h2 className={`${styles.questionTitle} ${className ?? ''}`} dangerouslySetInnerHTML={{__html: title}} />;

const Options = ({ children, className }: OptionsProps) => {
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
