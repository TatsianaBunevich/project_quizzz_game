export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export type SelectedAnswer = string | undefined;

export interface SelectedAnswers {
    [key: string]: SelectedAnswer;
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
