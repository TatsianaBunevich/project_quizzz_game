import { SliceWithMiddlewares } from "../typesStore";
import { SettingsType, SettingType, IdType, Question } from '../types';
import { DEFAULTSETTINGS } from '../constants';

interface Category {
	id: number;
	name: string;
}

interface CategoriesResponse {
	trivia_categories: Category[]
}

interface QuestionsResponse {
	results: Question[]
}

interface GameState {
	settings: SettingsType;
	questions: Question[];
	isLoading: boolean;
}

interface GameActions {
	updateSettings: () => Promise<void>;
	updateQuestions: () => Promise<void>;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
	resetGameState: () => void;
}

export type GameSlice = GameState & GameActions;

const initialGameState: GameState = {
	settings: structuredClone(DEFAULTSETTINGS),
	questions: [],
	isLoading: false,
}

export const createGameSlice: SliceWithMiddlewares<GameSlice> = (set, get) => ({
	...initialGameState,
	updateSettings: async () => {
		const data: CategoriesResponse | undefined = await fetchWithRetry(set, 'https://opentdb.com/api_category.php', 3, 300) as CategoriesResponse;
		set((draft) => {
			const triviaCategories = (data?.trivia_categories ?? []).map((category) => ({
				id: category.id.toString(),
				name: category.name,
				isSelect: false,
			}));
			draft.settings.category.push(...triviaCategories);
		},
		false,
		'game/updateSettings'
		);
	},
	updateQuestions: async () => {
		const data: { results?: Question[] } | undefined = await fetchWithRetry(set, createQuestionsUrl(get().settings), 3, 300) as QuestionsResponse;
		set({ questions: data?.results ?? [] },
			false,
			'game/updateQuestions'
		);
	},
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => {
		set((draft) => {
			if (setting === 'amount' || setting === 'timer') {
				draft.settings[setting] = optionId as number;
			} else {
				const settingsArray = draft.settings[setting];
				const foundItem = settingsArray.find((item) => item.id === optionId);

				settingsArray.forEach((item) => {
					item.isSelect = false;
				});

				if (foundItem) {
					foundItem.isSelect = true;
				}
			}
		},
		false,
		'game/handleSelectOption'
		);
	},
	resetGameState: () => {
		set(initialGameState,
			false,
			'game/resetGameState'
		)
	}
});

const fetchWithRetry = async <T extends GameState>(set: (partial: Partial<T>, replace?: boolean, name?: string) => void, url: string, retries: number, backoff: number) => {
	set({ isLoading: true } as Partial<T>, false, 'game/setIsLoadingTrue');
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
			set({ isLoading: false } as Partial<T>, false, 'game/setIsLoadingFalse');
		}
	}
};

const createQuestionsUrl = (settings: SettingsType) => {
	const createSettingId = (setting: SettingType[]) => {
		const foundItem = setting.find((item: SettingType) => item.isSelect === true);
		return foundItem?.id === 'any' ? '' : foundItem?.id;
	}
	const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

	return `https://opentdb.com/api.php?${params}`;
};
