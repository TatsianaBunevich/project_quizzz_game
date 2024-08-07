import { SliceWithMiddlewares } from "../typesStore";
import { Page } from '../types';

interface PageState {
    page: Page;
}

interface PageActions {
    setPage: (page: Page) => void;
}

export interface PageSlice extends PageState, PageActions {}

export const initialPageState: PageState = {
	page: null,
}

export const createPageSlice: SliceWithMiddlewares<PageSlice> = (set) => ({
	...initialPageState,
	setPage: (page) => {
		set({ page }, false, 'page/setPage');
	}
});
