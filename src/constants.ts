import { SettingsType, DifficultyType, TypeItem } from './types';

export const defaultSettings: SettingsType = {
	category: [
		{
			id: 'any',
			name: 'Any Category',
			isSelect: true
		}
	],
	difficulty: [
		{
			id: DifficultyType.ANY,
			name: 'Any Difficulty',
			isSelect: true
		},
		{
			id: DifficultyType.EASY,
			name: 'Easy',
			isSelect: false
		},
		{
			id: DifficultyType.MEDIUM,
			name: 'Medium',
			isSelect: false
		},
		{
			id: DifficultyType.HARD,
			name: 'Hard',
			isSelect: false
		}
	],
	type: [
		{
			id: TypeItem.ANY,
			name: 'Any Type',
			isSelect: true
		},
		{
			id: TypeItem.MULTIPLE,
			name: 'Multiple Choice',
			isSelect: false
		},
		{
			id: TypeItem.BOOLEAN,
			name: 'True/False',
			isSelect: false
		}
	],
	amount: 10
}