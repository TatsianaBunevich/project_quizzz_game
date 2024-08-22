import { ActionsWithMiddlewares, ControlsActions, BoundState, BoundActions } from './types';

export const createControlsActions: ActionsWithMiddlewares<
BoundState & BoundActions,
ControlsActions
> = (set, get) => ({
	handleSettings: () => {
		get().togglePlay();
		get().setPage('settings');
	},

	handleStartQuiz: async () => {
		get().setPage('quiz');
		await get().controlCountdown();
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
		await get().controlCountdown();
		get().sortQuestions();
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
		get().settings.timer && get().intervalId !== null && get().clearIntervalId();
		if (get().activeQuestionId === get().sortedQuestions.length - 1) {
			get().handleCheckAnswers();
		} else {
			get().settings.timer && get().incRoundTimeCounter(get().settings.timer - get().timeLeft);
			get().incActiveQuestionId();
			get().settings.timer && get().runQuestionTimer();
		}
	},

	handleOpenModal: () => {
		get().settings.timer && get().clearIntervalId();
		get().setIsModal(true);
	},

	handleCloseModal: () => {
		get().setIsModal(false);
		get().settings.timer && get().runQuestionTimer(get().timeLeft);
	},

	handleEndQuiz: () => {
		get().resetBoundStore();
	}
});
