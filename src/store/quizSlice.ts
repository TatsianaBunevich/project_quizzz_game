import { ActionsWithMiddlewares, QuizState, QuizActions, SettingsState, UtilsState, UtilsActions } from './types';
import { sortedQuestionsType, Status } from '../types';

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
QuizState &
Pick<QuizActions, 'sortQuestions' | 'runQuestionTimer' | 'handleNextButton' |'incActiveQuestionId' | 'decActiveQuestionId' | 'handleCheckAnswers' | 'handleOpenSettings' | 'incRoundTimeCounter' | 'calculateScore' | 'resetPartialQuizState'> &
SettingsState &
Pick<UtilsState, 'isModal' | 'timeLeft' |'intervalId'> &
Pick<UtilsActions, 'setIsModal' | 'setTimeLeft' |'runIntervalId' | 'clearIntervalId'>,
QuizActions
> = (set, get) => ({
	getQuestions: (data) => {
		set({ questions: data.results },
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
			get().handleOpenSettings();
		} else {
			get().decActiveQuestionId();
		}
	},

	handleNextButton: () => {
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeQuestionId === get().sortedQuestions.length - 1) {
			get().handleCheckAnswers();
		} else {
			get().settings.timer && get().incRoundTimeCounter(get().settings.timer - get().timeLeft);
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

	handleCheckAnswers: () => {
		get().settings.timer && get().incRoundTimeCounter(get().settings.timer - get().timeLeft);
		get().calculateScore();
		get().isModal && get().setIsModal(false);
	},

	handleOpenSettings: () => {
		get().resetPartialQuizState('scores');
		get().isModal && get().setIsModal(false);
	},

	handleOpenModal: () => {
		get().settings.timer && get().clearIntervalId();
		get().setIsModal(true);
	},

	handleCloseModal: () => {
		get().setIsModal(false);
		get().settings.timer && get().runQuestionTimer(get().timeLeft);
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

	handleNewTry: () => {
		get().resetPartialQuizState('questions', 'sortedQuestions', 'scores');
		get().sortQuestions();
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
