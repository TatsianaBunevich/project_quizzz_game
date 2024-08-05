import { SliceWithMiddlewares } from '../typesStore';

interface PlayState {
    play: boolean;
}

interface PlayActions {
    togglePlay: () => void;
}

export type PlaySlice = PlayState & PlayActions;

const initialPlayState: PlayState = {
	play: false,
}

export const createPlaySlice: SliceWithMiddlewares<PlaySlice> = (set) => ({
	...initialPlayState,
	togglePlay: () => set((state) => ({
		play: !state.play
	}),
	false,
	'play/togglePlay'
	)
});
