import { SliceWithMiddlewares } from "../typesStore";
import { Page } from '../types';

interface PageState {
    page: Page;
}

interface PageActions {
    setPage: (page: Page) => void;
}

export type PageSlice = PageState & PageActions;

const initialPageState: PageState = {
	page: null,
}

const createPageSlice: SliceWithMiddlewares<PageSlice> = (set) => ({
	...initialPageState,
	setPage: (page) => set(
		{ page },
		false,
		'play/setPage'
	),
});

export default createPageSlice;
