import { ActionsWithMiddlewares, UtilsState, UtilsActions } from './types';
import { Theme } from '../types';

export const initialUtilsState: UtilsState = {
	isPlay: false,
	theme: window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches ? Theme.DARK : Theme.LIGHT,
	timeLeft: 0,
	intervalId: null,
}

export const createUtilsActions: ActionsWithMiddlewares<
UtilsState & Pick<UtilsActions, 'setTimeLeft' | 'runIntervalId' | 'clearIntervalId'>,
UtilsActions
> = (set, get) => ({
	toggleIsPlay: () => {
		set((state) => ({ isPlay: !state.isPlay }),
			undefined,
			'utils/toggleIsPlay');
	},

	switchTheme: (theme) => {
		set({ theme },
			undefined,
			'utils/switchTheme');
	},

	setTimeLeft: (timeLeft) => {
		set({ timeLeft },
			undefined,
			'quiz/setTimeLeft');
	},

	runIntervalId: (callback) => {
		if (get().intervalId === null) {
			get().intervalId = window.setInterval(() => {
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
