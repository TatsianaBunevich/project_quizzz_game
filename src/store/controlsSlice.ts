import { ActionsWithMiddlewares, ControlsActions, BoundState, BoundActions } from './types';

export const createControlsActions: ActionsWithMiddlewares<
BoundState & BoundActions,
ControlsActions
> = (set, get) => ({
	handleSettings: async () => {
		get().togglePlay();
		get().setPage('settings');
		await get().updateSettings();
	},

	handleStartQuiz: async () => {
		get().setPage('quiz');
		get().toggleCountdown();
		get().runIntervalId(4);
		await get().getQuestions().then(() => get().sortQuestions());
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
		get().setPage('answers');
	},

	handleAnswersToResult: () => {
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
		get().runIntervalId(4);
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
	}
});
