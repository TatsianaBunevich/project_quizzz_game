import { ActionsWithMiddlewares, QuizState, QuizActions, SettingsState, UtilsActions } from './types';
import { SettingsType, SettingType, QuestionsResponse, sortedQuestionsType, Status } from '../types';

export const initialQuizState: QuizState = {
	questions: [],
	sortedQuestions: [],
	selectedAnswers: [],
	activeQuestionId: 0,
	calculatedScore: 0,
	roundScore: 0,
	roundStatus: Status.BAD,
	roundTimeCounter: 0,
	scores: [],
}

export const createQuizActions: ActionsWithMiddlewares<
QuizState & Pick<UtilsActions, 'fetchWithRetry'> & SettingsState,
QuizActions
> = (set, get) => ({
	getQuestions: async () => {
		const data = await get().fetchWithRetry(createQuestionsUrl(get().settings), 3, 300) as QuestionsResponse | undefined;
		set({ questions: data?.results ?? [] },
			undefined,
			'quiz/getQuestions');
	},

	sortQuestions: () => {
		set((state) => {
			const mappedQuestions: sortedQuestionsType[] = state.questions.map(q => ({
				question: q.question,
				answers: [
					{
						answer: q.correct_answer,
						isCorrect: true
					},
					...q.incorrect_answers.map(a => ({
						answer: a,
						isCorrect: false
					}))
				]
			}));
			const initialQuestions = state.sortedQuestions;
			const settedQuestions = !initialQuestions.length ? mappedQuestions : initialQuestions;

			settedQuestions.sort(() => Math.random() - 0.5).forEach(item => item.answers.sort(() => Math.random() - 0.5));
			state.sortedQuestions = settedQuestions;
		},
		undefined,
		'quiz/sortQuestions');
	},

	handleSelectAnswer: (question, a) => {
		set((state) => {
			const foundIndex = state.selectedAnswers.findIndex(item => item.question === question);
			if (foundIndex === -1) {
				state.selectedAnswers.push({
					question: question,
					answer: a.answer,
					isCorrect: a.isCorrect
				});
			} else if (state.selectedAnswers[foundIndex].answer === a.answer) {
				state.selectedAnswers.splice(foundIndex, 1);
			} else {
				state.selectedAnswers[foundIndex].answer = a.answer;
				state.selectedAnswers[foundIndex].isCorrect = a.isCorrect;
			}
		},
		undefined,
		'quiz/handleSelectAnswer');
	},

	incActiveQuestionId: () => {
		set((state) => {
			state.activeQuestionId += 1
		},
		undefined,
		'quiz/incActiveQuestionId');
	},

	decActiveQuestionId: () => {
		set((state) => {
			state.activeQuestionId -= 1
		},
		undefined,
		'quiz/decActiveQuestionId');
	},

	incRoundTimeCounter: (counter) => {
		set((state) => {
			state.roundTimeCounter += counter
		},
		undefined,
		'quiz/incRoundTimeCounter');
	},

	calculateScore: () => {
		set((state) => {
			const points = state.selectedAnswers.reduce((acc, item) => (item.isCorrect ? acc + 1 : acc), 0);
			const goal = state.sortedQuestions.length;
			const percentage = (points / goal) * 100;
			const total = Number(percentage.toFixed(0));
			const step = 100 / 3;
			const status = (percentage >= step * 2) ? Status.GOOD : (percentage >= step ? Status.NORMAL : Status.BAD);

			state.calculatedScore = points;
			state.roundScore = total;
			state.roundStatus = status;
			state.scores.push({
				index: state.scores.length + 1,
				total,
				status,
				time: state.roundTimeCounter
			});
		},
		undefined,
		'quiz/calculateScore');
	},

	resetScores: () => {
		set({ scores: initialQuizState.scores },
			undefined,
			'quiz/resetScores');
	},

	resetPartialQuizState: (...exceptParams) => {
		set((state) => {
			const newState = Object.entries(initialQuizState).reduce((acc, [key, value]) => {
				if (!exceptParams.includes(key as keyof QuizState)) {
					acc[key] = value as QuizState[keyof QuizState];
				}
				return acc;
			}, {} as Record<string, QuizState[keyof QuizState]>);

			Object.assign(state, newState);
		},
		undefined,
		'quiz/resetPartialQuizState');
	}
});

const createQuestionsUrl = (settings: SettingsType) => {
	const createSettingId = (setting: SettingType[]) => {
		const foundItem = setting.find((item: SettingType) => item.isSelect === true);
		return foundItem?.id === 'any' ? '' : foundItem?.id;
	}
	const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

	return `https://opentdb.com/api.php?${params}`;
};
