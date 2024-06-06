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