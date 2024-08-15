import { ActionsWithMiddlewares, SettingsState, SettingsActions, UtilsActions } from './types';
import { CategoriesResponse } from '../types';
import { DEFAULTSETTINGS } from '../constants';

export const initialSettingsState: SettingsState = {
	settings: structuredClone(DEFAULTSETTINGS),
}

export const createSettingsActions: ActionsWithMiddlewares<
SettingsState & Pick<UtilsActions, 'fetchWithRetry'>,
SettingsActions
> = (set, get) => ({
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
		undefined,
		'settings/updateSettings');
	},

	handleSelectOption: (optionId, setting) => {
		set((state) => {
			if (setting === 'amount' || setting === 'timer') {
				state.settings[setting] = optionId as number;
			} else {
				const settingsArray = state.settings[setting];
				const foundItem = settingsArray.find(item => item.id === optionId);

				settingsArray.forEach(item => item.isSelect = false);

				if (foundItem) {
					foundItem.isSelect = true;
				}
			}
		},
		undefined,
		'settings/handleSelectOption');
	}
});
