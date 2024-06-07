import styles from './Question.module.css';
import { Question as QuestionType, SelectedAnswer } from '../../types';

type QuestionProps = {
    question: QuestionType;
    selectedAnswer: SelectedAnswer;
    onSelectAnswer: (questionId: string, answer: SelectedAnswer) => void;
}

const Question = ({ question, selectedAnswer, onSelectAnswer }: QuestionProps) => {

	function decodeHtmlEntities(text: string) {
		const parser = new DOMParser();
		const decodedString = parser.parseFromString(text, 'text/html').body.textContent;

		return decodedString;
	}

	return (
		<div className={styles.question}>
			<h2>{decodeHtmlEntities(question.question)}</h2>
			<div className={styles.answers}>
				{question.answers.map((answer) => (
					<button
						key={answer}
						className={`${selectedAnswer === answer ? styles.selected : ''}`}
						onClick={() => onSelectAnswer(question.question, answer)}
					>
						{decodeHtmlEntities(answer)}
					</button>
				))}
			</div>
		</div>
	);
};

export default Question;
