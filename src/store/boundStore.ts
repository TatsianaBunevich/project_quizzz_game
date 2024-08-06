import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PlaySlice, initialPlayState, createPlaySlice } from './playSlice';
import { PageSlice, initialPageState, createPageSlice } from './pageSlice';
import { SettingsSlice, initialSettingsState, createSettingsSlice } from './settingsSlice';
import { QuizSlice, initialQuizState, createQuizSlice } from './quizSlice';
import { UtilsSlice, initialUtilsState, createUtilsSlice } from './utilsSlice';

export interface BoundState extends
PlaySlice,
PageSlice,
SettingsSlice,
QuizSlice,
UtilsSlice
{
	resetBoundStore: () => void;
}

const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(set, get, api) => ({
				...createPlaySlice(set, get, api),
				...createPageSlice(set, get, api),
				...createSettingsSlice(set, get, api),
				...createQuizSlice(set, get, api),
				...createUtilsSlice(set, get, api),
				resetBoundStore: () => {
					set(initialPlayState, false, 'store/resetPlayState');
					set(initialPageState, false, 'store/resetPageState');
					set(initialSettingsState, false, 'store/resetSettingsState');
					set(initialQuizState, false, 'store/resetQuizState');
					set(initialUtilsState, false, 'store/resetUtilsState');
				},
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

