import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsType, SettingType, QuestionsResponse, OptionalSelectedAnswer } from '../../types';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import DisplayedAnswer from '../DisplayedAnswer/DisplayedAnswer';
import styles from './Quiz.module.css';

const Quiz = () => {
	const {
		settings,
		sortedQuestions,
		selectedAnswers,
		activeQuestionId,
		sortQuestions,
		handleSelectAnswer
	} = useBoundStore(
		useShallow((state) => ({
			settings: state.settings,
			sortedQuestions: state.sortedQuestions,
			selectedAnswers: state.selectedAnswers,
			activeQuestionId: state.activeQuestionId,
			sortQuestions: state.sortQuestions,
			handleSelectAnswer: state.handleSelectAnswer
		}))
	);
	const selectedAnswer: OptionalSelectedAnswer = selectedAnswers.find(item => item?.question === sortedQuestions[activeQuestionId].question);

	const createQuestionsUrl = (settings: SettingsType) => {
		const createSettingId = (setting: SettingType[]) => {
			const foundItem = setting.find((item: SettingType) => item.isSelect === true);
			return foundItem?.id === 'any' ? '' : foundItem?.id;
		}
		const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

		return `https://opentdb.com/api.php?${params}`;
	};

	useSuspenseQuery({
		queryKey: ['questions'],
		queryFn: async () => {
			const response = await axios.get<QuestionsResponse>(createQuestionsUrl(settings));
			return response.data;
		},
		select: !sortedQuestions.length ? sortQuestions : undefined,
		staleTime: Infinity,
	});


	return (
		<div className={styles.quiz}>
			<Question>
				<Question.Id id={activeQuestionId} />
				<Question.Title title={sortedQuestions[activeQuestionId].question} />
				<Question.Options>
					{sortedQuestions[activeQuestionId].answers.map((a) => (
						<AnswerButton
							key={a.answer}
							className={selectedAnswer?.answer === a.answer ? styles.selected : ''}
							onClick={() => handleSelectAnswer(sortedQuestions[activeQuestionId].question, a)}
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
