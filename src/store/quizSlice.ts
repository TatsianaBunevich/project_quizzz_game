import { ActionsWithMiddlewares, QuizState, QuizActions, SettingsState, ScoresActions, UtilsState, UtilsActions } from './types';

export const initialQuizState: QuizState = {
	sortedQuestions: [],
	activeQuestionId: 0,
}

export const createQuizActions: ActionsWithMiddlewares<
QuizState &
Pick<QuizActions, 'sortQuestions' | 'runQuestionTimer' | 'handleNextButton' | 'incActiveQuestionId' | 'decActiveQuestionId' | 'resetQuiz'> &
SettingsState &
Pick<ScoresActions, 'addNewScore' | 'incScoreTime' | 'calculateScore'> &
Pick<UtilsState, 'timeLeft' |'intervalId'> &
Pick<UtilsActions, 'setTimeLeft' |'runIntervalId' | 'clearIntervalId'>,
QuizActions
> = (set, get) => ({
	sortQuestions: (data) => {
		set((state) => {
			let settedQuestions;

			if (data) {
				const mappedQuestions = data.results.map(q => ({
					question: q.question,
					answers: [
						{
							answer: q.correct_answer,
							isCorrect: true,
							isSelected: false
						},
						...q.incorrect_answers.map(a => ({
							answer: a,
							isCorrect: false,
							isSelected: false
						}))
					]
				}));
				settedQuestions = mappedQuestions;
			} else {
				settedQuestions = state.sortedQuestions;
			}

			settedQuestions.sort(() => Math.random() - 0.5).forEach(item => item.answers.sort(() => Math.random() - 0.5));
			state.sortedQuestions = settedQuestions;
		},
		undefined,
		'quiz/sortQuestions');
	},

	startCountdown: async () => {
		get().setTimeLeft(5);
		await new Promise<void>((resolve) => {
			get().runIntervalId(resolve);
		});
	},

	runQuestionTimer: (timer, callback) => {
		get().setTimeLeft(timer ?? get().settings.timer);
		get().runIntervalId(callback ?? get().handleNextButton);
	},

	handleSelectAnswer: (id, answer) => {
		set((state) => {
			const answers = state.sortedQuestions[id].answers;
			const selectedAnswer = answers.find(item => item.answer === answer);
			const isSelected = selectedAnswer?.isSelected;
			answers.forEach(item => item.isSelected = false);
			if (selectedAnswer) {
				selectedAnswer.isSelected = isSelected === true ? false : true;
			}
		},
		undefined,
		'quiz/handleSelectAnswer');
	},

	handlePrevButton: () => {
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeQuestionId === 0) {
			get().resetQuiz();
		} else {
			get().decActiveQuestionId();
		}
	},

	handleNextButton: () => {
		if (get().settings.timer) {
			get().intervalId !== null && get().clearIntervalId();
			get().incScoreTime(get().settings.timer - get().timeLeft);
		}
		if (get().activeQuestionId === get().sortedQuestions.length - 1) {
			get().calculateScore();
		} else {
			get().incActiveQuestionId();
		}
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

	resetQuiz: () => {
		set({ ...initialQuizState },
			undefined,
			'quiz/resetQuiz');
	},

	stopQuestionTimer: () => {
		get().clearIntervalId();
	},

	restartQuestionTimer: () => {
		get().runQuestionTimer(get().timeLeft);
	},

	handleNewTry: () => {
		set(() => ({ activeQuestionId: initialQuizState.activeQuestionId }),
			undefined,
			'quiz/resetActiveQuestionId');
		set((state) => { state.sortedQuestions.find(q => q.answers.find(ans => ans.isSelected = false)) },
			undefined,
			'quiz/resetSortedQuestions');
		get().sortQuestions();
		get().addNewScore();
	}
});
