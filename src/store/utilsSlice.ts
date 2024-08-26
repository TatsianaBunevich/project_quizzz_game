import { ActionsWithMiddlewares, UtilsState, UtilsActions } from './types';
import { Theme } from '../types';

export const initialUtilsState: UtilsState = {
	theme: window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches ? Theme.DARK : Theme.LIGHT,
	isModal: false,
	timeLeft: 0,
	intervalId: null,
}

export const createUtilsActions: ActionsWithMiddlewares<
UtilsState & Pick<UtilsActions, 'setTimeLeft' | 'runIntervalId' | 'clearIntervalId'>,
UtilsActions
> = (set, get) => ({
	switchTheme: (theme) => {
		set({ theme },
			undefined,
			'utils/switchTheme');
	},

	controlCountdown: async () => {
		get().setTimeLeft(5);
		await new Promise<void>((resolve) => {
			get().runIntervalId(resolve);
		});
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
