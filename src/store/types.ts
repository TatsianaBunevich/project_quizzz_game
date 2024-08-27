import { StateCreator } from 'zustand';
import {
	SettingsType, IdType,
	sortedQuestionsType, Answer, SelectedAnswer, Score, Status,
	CategoriesResponse, QuestionsResponse,
	Theme
} from '../types';

export type ActionsWithMiddlewares<T, U = T> = StateCreator<
    T,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    U
>;

export interface SettingsState {
	settings: SettingsType;
}

export interface QuizState {
	sortedQuestions: sortedQuestionsType[];
	selectedAnswers: SelectedAnswer[];
	activeQuestionId: number;
	calculatedScore: number;
	roundScore: number;
	roundStatus: Status;
	roundTimeCounter: number;
	scores: Score[];
}

export interface UtilsState {
	theme: Theme;
	timeLeft: number;
	intervalId: number | null;
}

export interface SettingsActions {
	updateSettings: (data: CategoriesResponse) => void;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
}

export interface QuizActions {
	sortQuestions: (data?: QuestionsResponse) => void;
	controlCountdown: () => Promise<void>;
	runQuestionTimer: (timer?: number) => void;
	handleSelectAnswer: (question: string, a: Answer) => void;
	handlePrevButton: () => void;
	handleNextButton: () => void;
	incActiveQuestionId: () => void;
	decActiveQuestionId: () => void;
	getRoundScore: () => void;
	resetQuiz: () => void;
	stopQuestionTimer: () => void;
	restartQuestionTimer: () => void;
	incRoundTimeCounter: (counter: number) => void;
	calculateScore: () => void;
	handleNewTry: () => void;
	resetScores: () => void;
	resetPartialQuizState: (...exceptParams: (keyof QuizState)[]) => void;
}

export interface UtilsActions {
	switchTheme: (theme: Theme) => void;
	setTimeLeft: (timeLeft: number) => void;
	runIntervalId: (callback: () => void) => void;
	clearIntervalId: () => void;
}

export interface BoundState extends
SettingsState,
QuizState,
UtilsState {}

export interface BoundActions extends
SettingsActions,
QuizActions,
UtilsActions {
	resetBoundStore: () => void;
}
