import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import { PlaySlice, createPlaySlice } from './playSlice';
import { PageSlice, createPageSlice } from './pageSlice';
import { GameSlice, createGameSlice } from './gameSlice';

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

