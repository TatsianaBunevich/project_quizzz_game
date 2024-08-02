import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import createPlaySlice, { PlaySlice } from './playSlice';

type BoundState = PlaySlice;
const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(...api) => ({
				...createPlaySlice(...api),
			})
		),
		{
			enabled: true,
			name: "bound store",
		}
	)
);

export default useBoundStore;
