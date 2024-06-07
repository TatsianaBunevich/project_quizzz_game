export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export interface ThemeProps {
	theme: Theme;
	onSwitchTheme: (theme: Theme) => void;
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

export interface QuestionProps {
    question: Question;
    selectedAnswer: string | undefined;
    onSelectAnswer: (questionId: string, answer: string) => void;
}

export type BlobProps = {
	theme: Theme;
    position: 'top' | 'bottom';
    width?: number;
    height?: number;
};