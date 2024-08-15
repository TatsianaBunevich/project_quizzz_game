import { ActionsWithMiddlewares, PlayState, PlayActions } from './types';

export const initialPlayState: PlayState = {
	play: false,
}

export const createPlayActions: ActionsWithMiddlewares<PlayState, PlayActions> = (set) => ({
	togglePlay: () => {
		set((state) => ({ play: !state.play }), undefined, 'play/togglePlay');
	}
});
