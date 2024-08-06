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

export interface SettingsSlice extends SettingsState, SettingsActions {}

export const initialSettingsState: SettingsState = {
	settings: structuredClone(DEFAULTSETTINGS),
}

export const createSettingsSlice: SliceWithMiddlewares<
SettingsSlice & UtilsSlice,
SettingsSlice
> = (set, get) => ({
	...initialSettingsState,
	updateSettings: async () => {
		const data = await get().fetchWithRetry('https://opentdb.com/api_category.php', 3, 300) as CategoriesResponse | undefined;
		set((state) => {
			const triviaCategories = (data?.trivia_categories ?? []).map((category) => ({
				id: category.id.toString(),
				name: category.name,
				isSelect: false,
			}));
			state.settings.category.push(...triviaCategories);
		},
		false,
		'settings/updateSettings'
		);
	},
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => {
		set((state) => {
			if (setting === 'amount' || setting === 'timer') {
				state.settings[setting] = optionId as number;
			} else {
				const settingsArray = state.settings[setting];
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
