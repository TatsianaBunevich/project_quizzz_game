import { SliceWithMiddlewares } from '../typesStore';
import { UtilsSlice } from './utilsSlice';
import { CategoriesResponse, SettingsType, IdType } from '../types';
import { DEFAULTSETTINGS } from '../constants';

interface SettingsState {
	settings: SettingsType;
}

interface SettingsActions {
	updateSettings: () => Promise<void>;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
}

export type SettingsSlice = SettingsState & SettingsActions;

const initialSettingsState: SettingsState = {
	settings: structuredClone(DEFAULTSETTINGS),
}

export const createSettingsSlice: SliceWithMiddlewares<
SettingsSlice & UtilsSlice,
SettingsSlice
> = (set, get) => ({
	...initialSettingsState,
	updateSettings: async () => {
		const data = await get().fetchWithRetry('https://opentdb.com/api_category.php', 3, 300) as CategoriesResponse | undefined;
		set((draft) => {
			const triviaCategories = (data?.trivia_categories ?? []).map((category) => ({
				id: category.id.toString(),
				name: category.name,
				isSelect: false,
			}));
			draft.settings.category.push(...triviaCategories);
		},
		false,
		'settings/updateSettings'
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
		'settings/handleSelectOption'
		);
	}
});
