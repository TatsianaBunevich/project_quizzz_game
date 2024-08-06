import { SliceWithMiddlewares } from '../typesStore';
import {  CategoriesResponse, QuestionsResponse } from '../types';

interface UtilsState {
	isLoading: boolean;
}

interface UtilsActions {
	fetchWithRetry: (url: string, retries: number, backoff: number) => Promise<CategoriesResponse | QuestionsResponse | undefined>;
}

export interface UtilsSlice extends UtilsState, UtilsActions {}

export const initialUtilsState: UtilsState = {
	isLoading: false,
}

export const createUtilsSlice: SliceWithMiddlewares<UtilsSlice> = (set) => ({
	...initialUtilsState,
	fetchWithRetry: async (url: string, retries: number, backoff: number) => {
		set({ isLoading: true }, false, 'utils/setIsLoadingTrue');
		for (let i = 0; i < retries; i++) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				return await response.json() as CategoriesResponse | QuestionsResponse;
			} catch (error) {
				if (i < retries - 1) {
					await new Promise(res => setTimeout(res, backoff * (i + 1)));
				} else {
					throw error;
				}
			} finally {
				set({ isLoading: false }, false, 'utils/setIsLoadingFalse');
			}
		}
	}
});
