import { SliceWithMiddlewares } from '../typesStore';
import { UtilsSlice } from './utilsSlice';
import { SettingsSlice } from './settingsSlice';
import { SettingsType, SettingType, QuestionsResponse, Question } from '../types';

import { useState, useEffect } from 'react';
import { sortedQuestionsType, Answer, SelectedAnswer, Score, Status } from '../types';

interface QuizState {
	questions: Question[];
	sortedQuestions: sortedQuestionsType[];
	selectedAnswers: SelectedAnswer[];
	activeQuestionId: number;
	isAnswersShown: boolean;
	calculatedScore: number;
	roundScore: number;
	roundStatus: Status;
	roundTimeCounter: number;
	scores: Score[];
}

interface QuizActions {
	getQuestions: () => Promise<void>;
	createSortedQuestions: () => void;
	updateSortedQuestions: () => void;
	handleSelectAnswer: (question: string, a: Answer) => void;
	incActiveQuestionId: () => void;
	decActiveQuestionId: () => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
	incRoundTimeCounter: () => void;
	calculateScore: () => void;
	resetScores: () => void;
	resetQuizStateExcept: (...exceptParams: (keyof QuizState)[]) => void;
}

export interface QuizSlice extends QuizState, QuizActions {}

export const initialQuizState: QuizState = {
	questions: [],
	sortedQuestions: [],
	selectedAnswers: [],
	activeQuestionId: 0,
	isAnswersShown: false,
	calculatedScore: 0,
	roundScore: 0,
	roundStatus: Status.BAD,
	roundTimeCounter: 0,
	scores: [],
}

export const createQuizSlice: SliceWithMiddlewares<
QuizSlice & UtilsSlice & SettingsSlice,
QuizSlice
> = (set, get) => ({
	...initialQuizState,
	getQuestions: async () => {
		const data = await get().fetchWithRetry(createQuestionsUrl(get().settings), 3, 300) as QuestionsResponse | undefined;
		set({ questions: data?.results ?? [] },
			false,
			'quiz/getQuestions'
		);
	},
	createSortedQuestions: () => {
		const mappedQuestions: sortedQuestionsType[] = get().questions.map(q => ({
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
			],
			timer: get().settings.timer
		}));

		set({ sortedQuestions: sortAnswers(mappedQuestions) },
			false,
			'quiz/createSortedQuestions'
		);
	},
	updateSortedQuestions: () => {
		set({ sortedQuestions: sortAnswers(get().sortedQuestions) },
			false,
			'quiz/updateSortedQuestions'
		);
	},
	handleSelectAnswer: (question: string, a: Answer) => {
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
		false,
		'quiz/handleSelectAnswer'
		);
	},
	incActiveQuestionId: () => {
		set((state) => {
			state.activeQuestionId += 1
		},
		false,
		'quiz/incActiveQuestionId'
		);
	},
	decActiveQuestionId: () => {
		set((state) => {
			state.activeQuestionId -= 1
		},
		false,
		'quiz/decActiveQuestionId'
		);
	},
	setIsAnswersShown: (isAnswersShown) => {
		set( { isAnswersShown },
			false,
			'quiz/setIsAnswersShown'
		);
	},
	incRoundTimeCounter: () => {
		set((state) => {
			state.roundTimeCounter += 1
		},
		false,
		'quiz/incActiveQuestionId'
		);
	},
	calculateScore: () => {
		const points = get().selectedAnswers.reduce((acc, item) => item.isCorrect ? acc + 1 : acc, 0);
		const goal = get().sortedQuestions.length;
		const percentage = (points / goal) * 100;
		const total = Number(percentage.toFixed(0));
		const step = 100 / 3;
		const status = percentage >= step * 2 ? Status.GOOD : percentage >= step ? Status.NORMAL : Status.BAD;

		set({
			calculatedScore: points,
			roundScore: total,
			roundStatus: status
		},
		false,
		'quiz/calculateScore'
		);

		set((state) => {
			state.scores.push({
				index: get().scores.length + 1,
				total,
				status: status,
				time: get().roundTimeCounter
			})
		},
		false,
		'quiz/updateTotalScore'
		);
	},
	resetScores: () => {
		set({ scores: initialQuizState.scores },
			false,
			'quiz/resetScores'
		);
	},
	resetQuizStateExcept: (...exceptParams) => {
		set((state) => {
			Object.keys(initialQuizState).forEach((key) => {
				if (!exceptParams.includes(key as keyof QuizState)) {
					state[key] = initialQuizState[key as keyof QuizState];
				}
			});
		},
		false,
		'quiz/resetQuizStateExcept'
		);
	},
});

const createQuestionsUrl = (settings: SettingsType) => {
	const createSettingId = (setting: SettingType[]) => {
		const foundItem = setting.find((item: SettingType) => item.isSelect === true);
		return foundItem?.id === 'any' ? '' : foundItem?.id;
	}
	const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

	return `https://opentdb.com/api.php?${params}`;
};

const sortAnswers = (questions: sortedQuestionsType[]) => {
	return structuredClone(questions).map(item => ({
		...item,
		answers: item.answers.sort(() => Math.random() - 0.5)
	}));
};

