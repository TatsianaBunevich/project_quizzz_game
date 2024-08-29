import { SettingsType, DifficultyType, TypeItem } from './types';

export const DEFAULTSETTINGS: SettingsType = {
	category: [
		{
			id: 'any',
			name: 'Any Category',
			isSelected: true
		}
	],
	difficulty: [
		{
			id: DifficultyType.ANY,
			name: 'Any Difficulty',
			isSelected: true
		},
		{
			id: DifficultyType.EASY,
			name: 'Easy',
			isSelected: false
		},
		{
			id: DifficultyType.MEDIUM,
			name: 'Medium',
			isSelected: false
		},
		{
			id: DifficultyType.HARD,
			name: 'Hard',
			isSelected: false
		}
	],
	type: [
		{
			id: TypeItem.ANY,
			name: 'Any Type',
			isSelected: true
		},
		{
			id: TypeItem.MULTIPLE,
			name: 'Multiple Choice',
			isSelected: false
		},
		{
			id: TypeItem.BOOLEAN,
			name: 'True/False',
			isSelected: false
		}
	],
	amount: 10,
	timer: 0
}
