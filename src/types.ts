export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export interface ThemeProps {
	theme: Theme;
	onSwitchTheme: (theme: Theme) => void;
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

export interface QuizProps {
    questions: Question[];
}

export interface QuestionProps {
    question: Question;
    selectedAnswer: SelectedAnswer;
    onSelectAnswer: (questionId: string, answer: SelectedAnswer) => void;
}

export type BlobProps = {
	theme: Theme;
    position: 'top' | 'bottom';
    width?: number;
    height?: number;
};