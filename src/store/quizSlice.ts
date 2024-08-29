import { ActionsWithMiddlewares, QuizState, QuizActions, SettingsState, ScoresActions, UtilsState, UtilsActions } from './types';

export const initialQuizState: QuizState = {
	sortedQuestions: [],
	selectedAnswers: [],
	activeQuestionId: 0,
}

export const createQuizActions: ActionsWithMiddlewares<
QuizState &
Pick<QuizActions, 'sortQuestions' | 'runQuestionTimer' | 'handleNextButton' |'incActiveQuestionId' | 'decActiveQuestionId' | 'getRoundScore' | 'resetQuiz'> &
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
							isCorrect: true
						},
						...q.incorrect_answers.map(a => ({
							answer: a,
							isCorrect: false
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

	controlCountdown: async () => {
		get().setTimeLeft(5);
		await new Promise<void>((resolve) => {
			get().runIntervalId(resolve);
		});
	},

	runQuestionTimer: (timer) => {
		get().setTimeLeft(timer ?? get().settings.timer);
		get().runIntervalId(get().handleNextButton);
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

	handlePrevButton: () => {
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeQuestionId === 0) {
			get().resetQuiz();
		} else {
			get().decActiveQuestionId();
		}
	},

	handleNextButton: () => {
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeQuestionId === get().sortedQuestions.length - 1) {
			get().getRoundScore();
		} else {
			get().settings.timer && get().incScoreTime(get().settings.timer - get().timeLeft);
			get().incActiveQuestionId();
			get().settings.timer && get().runQuestionTimer();
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

	getRoundScore: () => {
		get().settings.timer && get().incScoreTime(get().settings.timer - get().timeLeft);
		get().calculateScore();
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
		set(() => ({
			selectedAnswers: initialQuizState.selectedAnswers,
			activeQuestionId: initialQuizState.activeQuestionId,
		}));
		get().sortQuestions();
		get().addNewScore();
	}
});
