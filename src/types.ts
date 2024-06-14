export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export type Page = string | null;

export enum DifficultyType {
	ANY = 'any',
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard'
}

export enum TypeItem {
	ANY = 'any',
	MULTIPLE = 'multiple',
	BOOLEAN = 'boolean'
}

export type IdType = string | DifficultyType | TypeItem;

export type SettingType = {
	id: IdType;
	name: string;
	isSelect: boolean;
};

export type SettingsType = {
	category: SettingType[];
	difficulty: SettingType[];
	type: SettingType[];
	amount: number;
}

export interface SelectedAnswer {
	question: string;
	answer: string;
	isCorrect: boolean;
}

export interface Question {
	category: string;
	type: string;
	difficulty: string;
	question: string;
	correct_answer: string;
	incorrect_answers: string[];
	answers: string[];
}

export interface Answer {
	answer: string;
	isCorrect: boolean;
}

export interface sortedQuestionsType {
	question: string;
	answers: Answer[];
}

export enum Status {
	GOOD = 'good',
	NORMAL = 'normal',
	BAD = 'bad',
}

export interface Score {
	index: number;
	total: number;
	status: Status;
}