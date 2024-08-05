import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PlaySlice, createPlaySlice } from './playSlice';
import { PageSlice, createPageSlice } from './pageSlice';
import { SettingsSlice, createSettingsSlice } from './settingsSlice';
import { QuizSlice, createQuizSlice } from './quizSlice';
import { UtilsSlice, createUtilsSlice } from './utilsSlice';

type BoundState = PlaySlice & PageSlice & SettingsSlice & QuizSlice & UtilsSlice;

const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(...api) => ({
				...createPlaySlice(...api),
				...createPageSlice(...api),
				...createSettingsSlice(...api),
				...createQuizSlice(...api),
				...createUtilsSlice(...api),
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

