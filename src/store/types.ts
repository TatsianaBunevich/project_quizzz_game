import { StateCreator } from 'zustand';
import {
	Page,
	SettingsType, IdType,
	Question, sortedQuestionsType, Answer, SelectedAnswer, Score, Status,
	CategoriesResponse, QuestionsResponse
} from '../types';

export type ActionsWithMiddlewares<T, U = T> = StateCreator<
    T,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    U
>;

export interface PlayState {
    play: boolean;
}

export interface PageState {
    page: Page;
}

export interface SettingsState {
	settings: SettingsType;
}

export interface QuizState {
	questions: Question[];
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
	isLoading: boolean;
	isCountdown: boolean;
	isModal: boolean;
	timeLeft: number;
	intervalId: number | null;
}

export interface PlayActions {
    togglePlay: () => void;
}

export interface PageActions {
    setPage: (page: Page) => void;
}

export interface SettingsActions {
	updateSettings: () => Promise<void>;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
}

export interface QuizActions {
	getQuestions: () => Promise<void>;
	sortQuestions: () => void;
	handleSelectAnswer: (question: string, a: Answer) => void;
	incActiveQuestionId: () => void;
	decActiveQuestionId: () => void;
	incRoundTimeCounter: (counter: number) => void;
	calculateScore: () => void;
	resetScores: () => void;
	resetPartialQuizState: (...exceptParams: (keyof QuizState)[]) => void;
}

export interface UtilsActions {
	fetchWithRetry: (url: string, retries: number, backoff: number) => Promise<CategoriesResponse | QuestionsResponse | undefined>;
	toggleCountdown: () => void;
	setIsModal: (isModal: boolean) => void;
	runIntervalId: (timer: number) => void;
	clearIntervalId: () => void;
}

export interface ControlsActions {
	handleSettings: () => Promise<void>;
	handleStartQuiz: () => Promise<void>;
	handleCheckAnswers: () => void;
	handleShowAnswers: () => void;
	handleAnswersToResult: () => void;
	handleShowScoreboard: () => void;
	handleScoreboardToResult: () => void;
	handleNewTry: () => Promise<void>;
	handleOpenSettings: () => void;
	handlePrevButton: () => void;
	handleNextButton: () => void;
	handleOpenModal: () => void;
	handleCloseModal: () => void;
	handleEndQuiz: () => void;
}

export interface BoundState extends
PlayState,
PageState,
SettingsState,
QuizState,
UtilsState {}

export interface BoundActions extends
PlayActions,
PageActions,
SettingsActions,
QuizActions,
UtilsActions,
ControlsActions {
	resetBoundStore: () => void;
}
