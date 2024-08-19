import { ActionsWithMiddlewares, UtilsState, UtilsActions, SettingsState, ControlsActions } from './types';
import { CategoriesResponse, QuestionsResponse } from '../types';

export const initialUtilsState: UtilsState = {
	isLoading: false,
	isCountdown: false,
	isModal: false,
	timeLeft: 0,
	intervalId: null,
}

export const createUtilsActions: ActionsWithMiddlewares<
UtilsState & Pick<UtilsActions, 'setIsCountdown' | 'setTimeLeft' | 'runIntervalId' | 'clearIntervalId'> & SettingsState & Pick<ControlsActions, 'handleNextButton'>,
UtilsActions
> = (set, get) => ({
	fetchWithRetry: async (url, retries, backoff) => {
		set({ isLoading: true }, undefined, 'utils/setIsLoadingTrue');
		for (let i = 0; i < retries; i++) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				return await response.json() as CategoriesResponse | QuestionsResponse;
			} catch (error) {
				if (i < retries - 1) {
					await new Promise(res => setTimeout(res, backoff * (i + 1)));
				} else {
					throw error;
				}
			} finally {
				set({ isLoading: false }, undefined, 'utils/setIsLoadingFalse');
			}
		}
	},

	controlCountdown: async () => {
		get().setIsCountdown(true);
		get().setTimeLeft(5);
		await new Promise<void>((resolve) => {
			get().runIntervalId(resolve);
		});
		get().setIsCountdown(false);
	},

	setIsCountdown: (isCountdown) => {
		set({ isCountdown },
			undefined,
			'utils/setIsCountdown');
	},

	runQuestionTimer: (timer) => {
		get().setTimeLeft(timer ?? get().settings.timer);
		get().runIntervalId(get().handleNextButton);
	},

	setIsModal: (isModal) => {
		set({ isModal },
			undefined,
			'utils/setIsModal');
	},

	setTimeLeft: (timeLeft) => {
		set({ timeLeft },
			undefined,
			'quiz/setTimeLeft');
	},

	runIntervalId: (callback) => {
		if (get().intervalId === null) {
			get().intervalId = setInterval(() => {
				set((state) => { state.timeLeft -= 1 }, undefined, 'quiz/decTimeLeft');
				if (get().timeLeft === 0) {
					get().clearIntervalId();
					callback();
				}
			}, 1000);
		}
	},

	clearIntervalId: () => {
		set((state) => {
			if (state.intervalId !== null) {
				clearInterval(state.intervalId);
				state.intervalId = null;
			}
		},
		undefined,
		'quiz/clearIntervalId');
	}
});
