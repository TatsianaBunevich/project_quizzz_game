import { ActionsWithMiddlewares, PageState, PageActions } from './types';

export const initialPageState: PageState = {
	page: null,
}

export const createPageActions: ActionsWithMiddlewares<PageState, PageActions> = (set) => ({
	setPage: (page) => {
		set({ page }, undefined, 'page/setPage');
	}
});
