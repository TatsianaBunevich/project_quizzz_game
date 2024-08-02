import { StateCreator } from 'zustand';

interface PlayState {
    play: boolean;
}

interface PlayActions {
    setPlay: (play: boolean) => void;
}

export type PlaySlice = PlayState & PlayActions;

const initialPlayState: PlayState = {
	play: false,
}

const createPlaySlice: StateCreator<PlaySlice> = (set) => ({
	...initialPlayState,
	setPlay: (newPlay) => set({ play: newPlay }),
});

export default createPlaySlice;
