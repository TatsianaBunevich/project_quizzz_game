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
UtilsState & Pick<UtilsActions, 'toggleCountdown' | 'clearIntervalId'> & SettingsState & Pick<ControlsActions, 'handleNextButton'>,
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

	toggleCountdown: () => {
		set((state) => ({ isCountdown: !state.isCountdown }),
			undefined,
			'utils/toggleCountdown');
	},

	setIsModal: (isModal) => {
		set({ isModal },
			undefined,
			'utils/setIsModal');
	},

	runIntervalId: (timer) => {
		if (get().intervalId === null) {
			set({ timeLeft: timer }, undefined, 'quiz/setInitTimeLeft');

			get().intervalId = setInterval(() => {
				set((state) => { state.timeLeft -= 1; }, undefined, 'quiz/decTimeLeft');
				if (get().timeLeft === 0) {
					if (get().settings.timer && !get().isCountdown) {
						get().handleNextButton();
					}
				} else if (get().timeLeft === -1) {
					if (get().isCountdown) {
						get().toggleCountdown();
						get().clearIntervalId();
					}
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
