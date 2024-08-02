import { SliceWithMiddlewares } from "../typesStore";

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

const createPlaySlice: SliceWithMiddlewares<PlaySlice> = (set) => ({
	...initialPlayState,
	setPlay: (newPlay) => set(
		{ play: newPlay },
		false,
		'play/setPlay'
	),
});

export default createPlaySlice;
