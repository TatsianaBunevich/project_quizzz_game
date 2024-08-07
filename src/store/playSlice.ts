import { SliceWithMiddlewares } from '../typesStore';

interface PlayState {
    play: boolean;
}

interface PlayActions {
    togglePlay: () => void;
}

export interface PlaySlice extends PlayState, PlayActions {}

export const initialPlayState: PlayState = {
	play: false,
}

export const createPlaySlice: SliceWithMiddlewares<PlaySlice> = (set) => ({
	...initialPlayState,
	togglePlay: () => {
		set((state) => ({ play: !state.play }), false, 'play/togglePlay');
	}
});
