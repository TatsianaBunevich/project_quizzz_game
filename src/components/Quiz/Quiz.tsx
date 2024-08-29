import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { sortedQuestionsType, QuestionsResponse } from '../../types';
import { QuizState, QuizActions } from '../../store/types';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import styles from './Quiz.module.css';

interface QuizProps extends Pick<QuizActions, 'sortQuestions' | 'handleSelectAnswer'> {
	params: string,
	isSortQuestions: boolean,
	sortedQuestion: sortedQuestionsType,
	id: QuizState['activeQuestionId'],
}

const Quiz = ({ params, isSortQuestions, sortedQuestion, id, sortQuestions, handleSelectAnswer }: QuizProps) => {

	useSuspenseQuery({
		queryKey: ['questions'],
		queryFn: async () => {
			const response = await axios.get<QuestionsResponse>(params);
			return response.data;
		},
		select: isSortQuestions ? sortQuestions : undefined,
		staleTime: Infinity,
	});

	return (
		<div className={styles.quiz}>
			<Question>
				<Question.Id id={id} />
				<Question.Title title={sortedQuestion.question} />
				<Question.Options>
					{sortedQuestion.answers.map((a) => (
						<AnswerButton
							key={a.answer}
							className={a.isSelected ? styles.selected : ''}
							onClick={() => handleSelectAnswer(id, a.answer)}
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
