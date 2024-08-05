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
}

interface QuizActions {
	getQuestions: () => Promise<void>;
	createSortedQuestions: () => void;
	updateSortedQuestions: () => void;
	handleSelectAnswer: (question: string, a: Answer) => void;
	incActiveQuestionId: () => void;
	decActiveQuestionId: () => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
}

export type QuizSlice = QuizState & QuizActions;

export const initialQuizState: QuizState = {
	questions: [],
	sortedQuestions: [],
	selectedAnswers: [],
	activeQuestionId: 0,
	isAnswersShown: false,
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
			'quiz/updateQuestions'
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
		set((draft) => {
			const foundIndex = draft.selectedAnswers.findIndex(item => item.question === question);
			if (foundIndex === -1) {
				draft.selectedAnswers.push({
					question: question,
					answer: a.answer,
					isCorrect: a.isCorrect
				});
			} else if (draft.selectedAnswers[foundIndex].answer === a.answer) {
				draft.selectedAnswers.splice(foundIndex, 1);
			} else {
				draft.selectedAnswers[foundIndex].answer = a.answer;
				draft.selectedAnswers[foundIndex].isCorrect = a.isCorrect;
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
		)
	},
	decActiveQuestionId: () => {
		set((state) => {
			state.activeQuestionId -= 1
		},
		false,
		'quiz/decActiveQuestionId'
		)
	},
	setIsAnswersShown: (isAnswersShown) => set(
		{ isAnswersShown },
		false,
		'quiz/setIsAnswersShown'
	),
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

