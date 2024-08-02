import { StateCreator } from 'zustand';
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

const createPageSlice: StateCreator<PageSlice> = (set) => ({
	...initialPageState,
	setPage: (newPage) => set({ page: newPage }),
});

export default createPageSlice;
