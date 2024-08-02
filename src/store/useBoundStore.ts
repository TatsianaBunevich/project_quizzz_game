import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import createPlaySlice, { PlaySlice } from './playSlice';
import createPageSlice, { PageSlice } from './pageSlice';
type BoundState = PlaySlice & PageSlice;

type BoundState = PlaySlice;
const useBoundStore = create<BoundState>()(
	devtools(
		immer(
			(...api) => ({
				...createPlaySlice(...api),
				...createPageSlice(...api),
			})
		),
		{
			enabled: true,
			name: "bound store",
		}
	)
);

export default useBoundStore;
