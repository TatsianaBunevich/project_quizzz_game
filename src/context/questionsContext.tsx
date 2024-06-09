import { useState, useEffect, createContext } from 'react';
import { Question, sortedQuestionsType, Answer, SelectedAnswer } from '../types';

type QuestionsContextType = {
    sortedQuestions: sortedQuestionsType[];
    selectedAnswers: SelectedAnswer[];
	handleSelectAnswer: (question: string, a: Answer) => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
	isAnswersShown: boolean;
	clearState: () => void;
}

export const QuestionsContext = createContext<QuestionsContextType>({
	sortedQuestions: [],
	selectedAnswers: [],
	handleSelectAnswer: () => {},
	setIsAnswersShown: () => {},
	isAnswersShown: false,
	clearState: () => {}
});

export const QuestionsContextProvider = ({ children, questions }: { children: React.ReactNode, questions: Question[] }) => {
	const [sortedQuestions, setSortedQuestions] = useState<sortedQuestionsType[]>([]);
	const [isAnswersShown, setIsAnswersShown] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);

	useEffect(() => {
		const sortedQuestions = questions.map(q => ({
			question: q.question,
			answers: [
				{
					answer: q.correct_answer,
					isCorrect: true
				},
				...q.incorrect_answers.map(a => ({
					answer: a,
					isCorrect: false
				}))
			].sort(() => Math.random() - 0.5)
		}));

		setSortedQuestions(sortedQuestions);
	}, [questions]);

	const handleSelectAnswer = (question: string, a: Answer) => {
		setSelectedAnswers(prev => {
			const newPrev = [...prev];
			const foundIndex = newPrev.findIndex(item => item.question === question);
			if (foundIndex === -1) {
				return [...newPrev,
					{
						question: question,
						answer: a.answer,
						isCorrect: a.isCorrect
					}
				]
			} else if (newPrev[foundIndex].answer === a.answer) {
				newPrev.splice(foundIndex, 1);
			} else {
				newPrev[foundIndex] = {
					...newPrev[foundIndex],
					answer: a.answer,
					isCorrect: a.isCorrect
				}
			}

			return newPrev;
		});
	};

	const clearState = () => {
		setIsAnswersShown(false);
		setSelectedAnswers([]);
	}

	return (
		<QuestionsContext.Provider value={
			{
				sortedQuestions,
				selectedAnswers,
				handleSelectAnswer,
				setIsAnswersShown,
				isAnswersShown,
				clearState
			}
		}>
			{children}
		</QuestionsContext.Provider>
	)
}

