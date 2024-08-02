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
	setPage: (newPage) => set(
		{ page: newPage },
		false,
		'play/setPage'
	),
});

export default createPageSlice;
