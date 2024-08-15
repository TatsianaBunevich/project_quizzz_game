import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BoundState, BoundActions } from './types';
import { initialPlayState, createPlayActions } from './playSlice';
import { initialPageState, createPageActions } from './pageSlice';
import { initialSettingsState, createSettingsActions } from './settingsSlice';
import { initialQuizState, createQuizActions } from './quizSlice';
import { initialUtilsState, createUtilsActions } from './utilsSlice';
import { createControlsActions } from './controlsSlice';

const initialBoundState: BoundState = {
	...initialPlayState,
	...initialPageState,
	...initialSettingsState,
	...initialQuizState,
	...initialUtilsState,
}

const useBoundStore = create<BoundState & BoundActions>()(
	devtools(
		immer(
			(set, get, api) => ({
				...initialBoundState,
				...createPlayActions(set, get, api),
				...createPageActions(set, get, api),
				...createSettingsActions(set, get, api),
				...createQuizActions(set, get, api),
				...createUtilsActions(set, get, api),
				...createControlsActions(set, get, api),
				resetBoundStore: () => {
					set({ ...initialBoundState }, false, 'store/resetBoundStore');
				}
			}),
		),
		{
			enabled: true, // Enable/Disable Redux DevTools
			name: "bound store",
			serialize: {
				options: false
			}
		}
	)
);

export default useBoundStore;
