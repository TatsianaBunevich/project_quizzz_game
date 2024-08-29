import { ActionsWithMiddlewares, QuizState, QuizActions, SettingsState, ScoresActions, UtilsState, UtilsActions } from './types';

export const initialQuizState: QuizState = {
	quizItems: [],
	activeId: 0,
}

export const createQuizActions: ActionsWithMiddlewares<
QuizState &
Pick<QuizActions, 'sortQuizItems' | 'startTimer' | 'handleNextButton' | 'incActiveId' | 'decActiveId' | 'resetQuiz'> &
SettingsState &
Pick<ScoresActions, 'addNewScore' | 'incScoreTime' | 'calculateScore'> &
Pick<UtilsState, 'timeLeft' |'intervalId'> &
Pick<UtilsActions, 'setTimeLeft' |'runIntervalId' | 'clearIntervalId'>,
QuizActions
> = (set, get) => ({
	sortQuizItems: (data) => {
		set((state) => {
			let quizItemsForSort;

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
				quizItemsForSort = mappedQuestions;
			} else {
				quizItemsForSort = state.quizItems;
			}

			quizItemsForSort.sort(() => Math.random() - 0.5).forEach(item => item.answers.sort(() => Math.random() - 0.5));
			state.quizItems = quizItemsForSort;
		},
		undefined,
		'quiz/sortQuizItems');
	},

	startCountdown: async () => {
		get().setTimeLeft(5);
		await new Promise<void>((resolve) => {
			get().runIntervalId(resolve);
		});
	},

	startTimer: (timer, callback) => {
		get().setTimeLeft(timer ?? get().settings.timer);
		get().runIntervalId(callback ?? get().handleNextButton);
	},

	handleSelectAnswer: (id, answer) => {
		set((state) => {
			const answers = state.quizItems[id].answers;
			const selectedAnswer = answers.find(item => item.answer === answer);
			const isSelected = selectedAnswer?.isSelected;
			answers.forEach(item => item.isSelected = false);
			if (selectedAnswer) {
				selectedAnswer.isSelected = !isSelected;
			}
		},
		undefined,
		'quiz/handleSelectAnswer');
	},

	handlePrevButton: () => {
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeId === 0) {
			get().resetQuiz();
		} else {
			get().decActiveId();
		}
	},

	handleNextButton: () => {
		if (get().settings.timer) {
			get().intervalId !== null && get().clearIntervalId();
			get().incScoreTime(get().settings.timer - get().timeLeft);
		}
		if (get().activeId === get().quizItems.length - 1) {
			get().calculateScore();
		} else {
			get().incActiveId();
		}
	},

	incActiveId: () => {
		set((state) => {
			state.activeId += 1
		},
		undefined,
		'quiz/incActiveId');
	},

	decActiveId: () => {
		set((state) => {
			state.activeId -= 1
		},
		undefined,
		'quiz/decActiveId');
	},

	resetQuiz: () => {
		set({ ...initialQuizState },
			undefined,
			'quiz/resetQuiz');
	},

	stopTimer: () => {
		get().clearIntervalId();
	},

	restartTimer: () => {
		get().startTimer(get().timeLeft);
	},

	handleNewTry: () => {
		set(() => ({ activeId: initialQuizState.activeId }),
			undefined,
			'quiz/resetActiveId');
		set((state) => { state.quizItems.find(q => q.answers.find(ans => ans.isSelected = false)) },
			undefined,
			'quiz/resetQuizItems');
		get().sortQuizItems();
		get().addNewScore();
	}
});
