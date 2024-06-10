export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
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

export interface Score {
	timestamp: Date;
	score: string;
	questions: string;
	win: boolean;
}