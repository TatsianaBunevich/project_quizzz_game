import { StateCreator } from 'zustand';
import {
	SettingsType, IdType,
	sortedQuestionsType, Answer, SelectedAnswer, Score,
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
}

export interface ScoresState {
	scores: Score[];
}

export interface UtilsState {
	isPlay: boolean;
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
	startCountdown: () => Promise<void>;
	runQuestionTimer: (timer?: number, callback?: () => void) => void;
	handleSelectAnswer: (question: string, a: Answer) => void;
	handlePrevButton: () => void;
	handleNextButton: () => void;
	incActiveQuestionId: () => void;
	decActiveQuestionId: () => void;
	getRoundScore: () => void;
	resetQuiz: () => void;
	stopQuestionTimer: () => void;
	restartQuestionTimer: () => void;
	handleNewTry: () => void;
}

export interface ScoresActions {
	addNewScore: () => void;
	incScoreTime: (time: number) => void;
	calculateScore: () => void;
	resetScores: () => void;
}

export interface UtilsActions {
	toggleIsPlay: () => void;
	switchTheme: (theme: Theme) => void;
	setTimeLeft: (timeLeft: number) => void;
	runIntervalId: (callback: () => void) => void;
	clearIntervalId: () => void;
}

export interface BoundState extends
SettingsState,
QuizState,
ScoresState,
UtilsState {}

export interface BoundActions extends
SettingsActions,
QuizActions,
ScoresActions,
UtilsActions {
	resetBoundStore: () => void;
}
