import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PlaySlice, initialPlayState, createPlaySlice } from './playSlice';
import { PageSlice, initialPageState, createPageSlice } from './pageSlice';
import { SettingsSlice, initialSettingsState, createSettingsSlice } from './settingsSlice';
import { QuizSlice, initialQuizState, createQuizSlice } from './quizSlice';
import { UtilsSlice, initialUtilsState, createUtilsSlice } from './utilsSlice';

export interface BoundActions {
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
	resetBoundStore: () => void;
}

export interface BoundState extends
PlaySlice,
PageSlice,
SettingsSlice,
QuizSlice,
UtilsSlice,
BoundActions {}

const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(set, get, api) => ({
				...createPlaySlice(set, get, api),
				...createPageSlice(set, get, api),
				...createSettingsSlice(set, get, api),
				...createQuizSlice(set, get, api),
				...createUtilsSlice(set, get, api),

				handleSettings: async () => {
					get().togglePlay();
					get().setPage('settings');
					await get().updateSettings();
				},

				handleStartQuiz: async () => {
					get().setPage('quiz');
					get().toggleCountdown();
					await get().getQuestions();
					get().sortQuestions();
					await new Promise((resolve) => setTimeout(resolve, 5000));
					get().settings.timer && get().runIntervalId(get().settings.timer);
				},

				handleCheckAnswers: () => {
					get().settings.timer && get().incRoundTimeCounter(get().settings.timer - get().timeLeft);
					get().calculateScore();
					get().isModal && get().setIsModal(false);
					get().setPage('result');
				},

				handleShowAnswers: () => {
					get().setIsAnswersShown(true);
					get().setPage('quiz');
				},

				handleAnswersToResult: () => {
					get().setIsAnswersShown(false);
					get().setPage('result');
				},

				handleShowScoreboard: () => {
					get().setPage('scoreboard');
				},

				handleScoreboardToResult: () => {
					get().setPage('result');
				},

				handleNewTry: async () => {
					get().resetPartialQuizState('questions', 'sortedQuestions', 'scores');
					get().setPage('quiz');
					get().toggleCountdown();
					get().sortQuestions();
					await new Promise((resolve) => setTimeout(resolve, 5000));
					get().settings.timer && get().runIntervalId(get().settings.timer);
				},

				handleOpenSettings: () => {
					get().resetPartialQuizState('scores');
					get().isModal && get().setIsModal(false);
					get().setPage('settings');
				},

				handlePrevButton: () => {
					if (get().activeQuestionId === 0) {
						get().handleOpenSettings();
					} else {
						get().decActiveQuestionId();
					}
				},

				handleNextButton: () => {
					get().settings.timer && get().clearIntervalId();
					if (get().activeQuestionId === get().sortedQuestions.length - 1) {
						get().handleCheckAnswers();
					} else {
						get().settings.timer && get().incRoundTimeCounter(get().settings.timer - get().timeLeft);
						get().incActiveQuestionId();
						get().settings.timer && get().runIntervalId(get().settings.timer);
					}
				},

				handleOpenModal: () => {
					get().settings.timer && get().clearIntervalId();
					get().setIsModal(true);
				},

				handleCloseModal: () => {
					get().setIsModal(false);
					get().settings.timer && get().runIntervalId(get().timeLeft);
				},

				handleEndQuiz: () => {
					get().resetBoundStore();
				},

				resetBoundStore: () => {
					set({
						...initialPlayState,
						...initialPageState,
						...initialSettingsState,
						...initialQuizState,
						...initialUtilsState,
					}, false, 'store/resetBoundStore');
				}
			}),
		),
		{
			enabled: true,
			name: "bound store",
			serialize: {
				options: false
			}
		}
	)
);

export default useBoundStore;
