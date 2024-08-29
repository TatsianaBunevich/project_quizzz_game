import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QuizItemType, QuestionsResponse } from '../../types';
import { QuizState, QuizActions } from '../../store/types';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import styles from './Quiz.module.css';

interface QuizProps extends Pick<QuizState, 'activeId'>, Pick<QuizActions, 'sortQuizItems' | 'handleSelectAnswer'> {
	params: string,
	isSortQuizItems: boolean,
	quizItem: QuizItemType,
}

const Quiz = ({ params, isSortQuizItems, quizItem, activeId, sortQuizItems, handleSelectAnswer }: QuizProps) => {

	useSuspenseQuery({
		queryKey: ['questions'],
		queryFn: async () => {
			const response = await axios.get<QuestionsResponse>(params);
			return response.data;
		},
		select: isSortQuizItems ? sortQuizItems : undefined,
		staleTime: Infinity,
	});

	return (
		<div className={styles.quiz}>
			<Question>
				<Question.Id id={activeId} />
				<Question.Title title={quizItem.question} />
				<Question.Options>
					{quizItem.answers.map((a) => (
						<AnswerButton
							key={a.answer}
							className={a.isSelected ? styles.selected : ''}
							onClick={() => handleSelectAnswer(activeId, a.answer)}
						>
							<DisplayedAnswer text={a.answer} />
						</AnswerButton>
					))}
				</Question.Options>
			</Question>
		</div>
	);
};

export default Quiz;
