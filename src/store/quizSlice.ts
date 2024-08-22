import { ActionsWithMiddlewares, QuizState, QuizActions } from './types';
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
QuizState,
QuizActions
> = (set) => ({
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
