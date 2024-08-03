import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import createPlaySlice, { PlaySlice } from './playSlice';
import createPageSlice, { PageSlice } from './pageSlice';
import createGameSlice, { GameSlice } from './gameSlice';

type BoundState = PlaySlice & PageSlice & GameSlice;

const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(...api) => ({
				...createPlaySlice(...api),
				...createPageSlice(...api),
				...createGameSlice(...api),
			}),
		),
		{
			enabled: true,
			name: "bound store",
		}
	)
);

export default useBoundStore;

