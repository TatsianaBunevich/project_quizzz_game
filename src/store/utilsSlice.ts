import { SliceWithMiddlewares } from '../typesStore';
import { SettingsSlice } from './settingsSlice';
import { BoundActions } from './boundStore';
import { CategoriesResponse, QuestionsResponse } from '../types';

interface UtilsState {
	isLoading: boolean;
	isCountdown: boolean;
	isModal: boolean;
	timeLeft: number;
	intervalId: number | null;
}

interface UtilsActions {
	fetchWithRetry: (url: string, retries: number, backoff: number) => Promise<CategoriesResponse | QuestionsResponse | undefined>;
	toggleCountdown: () => void;
	setIsModal: (isModal: boolean) => void;
	runIntervalId: (timer: number) => void;
	clearIntervalId: () => void;
}

export interface UtilsSlice extends UtilsState, UtilsActions {}

export const initialUtilsState: UtilsState = {
	isLoading: false,
	isCountdown: false,
	isModal: false,
	timeLeft: 0,
	intervalId: null,
}

export const createUtilsSlice: SliceWithMiddlewares<
UtilsSlice & SettingsSlice & BoundActions,
UtilsSlice
> = (set, get) => ({
	...initialUtilsState,

	fetchWithRetry: async (url, retries, backoff) => {
		set({ isLoading: true }, false, 'utils/setIsLoadingTrue');
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
				set({ isLoading: false }, false, 'utils/setIsLoadingFalse');
			}
		}
	},

	toggleCountdown: () => {
		set((state) => ({ isCountdown: !state.isCountdown }), false, 'utils/toggleCountdown');
	},

	setIsModal: (isModal) => {
		set({ isModal }, false, 'utils/setIsModal');
	},

	runIntervalId: (timer) => {
		if (get().intervalId === null) {
			set({ timeLeft: timer }, false, 'quiz/setInitTimeLeft');

			get().intervalId = setInterval(() => {
				set((state) => { state.timeLeft -= 1; }, false, 'quiz/decTimeLeft');
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
		false, 'quiz/clearIntervalId');
	}
});
