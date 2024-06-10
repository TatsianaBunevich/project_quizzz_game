import { useState, useEffect, createContext } from 'react';
import { Question, sortedQuestionsType, Answer, SelectedAnswer, Score } from '../types';

type QuestionsContextType = {
    sortedQuestions: sortedQuestionsType[];
    selectedAnswers: SelectedAnswer[];
	handleSelectAnswer: (question: string, a: Answer) => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
	isAnswersShown: boolean;
	clearState: () => void;
	calculateScore: () => void;
	calculatedScore: number;
	isWin: boolean;
	score: Score[];
	clearHistory: () => void;
}

export const QuestionsContext = createContext<QuestionsContextType>({
	sortedQuestions: [],
	selectedAnswers: [],
	handleSelectAnswer: () => {},
	setIsAnswersShown: () => {},
	isAnswersShown: false,
	clearState: () => {},
	calculateScore: () => {},
	calculatedScore: 0,
	isWin: false,
	score: [],
	clearHistory: () => {}
});

export const QuestionsContextProvider = ({ children, questions }: { children: React.ReactNode, questions: Question[] }) => {
	const [sortedQuestions, setSortedQuestions] = useState<sortedQuestionsType[]>([]);
	const [isAnswersShown, setIsAnswersShown] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
	const [calculatedScore, setCalculatedScore] = useState(0);
	const [isWin, setIsWin] = useState(false);
	const [score, setScore] = useState<Score[]>([]);

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
		setCalculatedScore(0);
		setIsWin(false);
	}

	const calculateScore = () => {
		const score = selectedAnswers.reduce((acc, item) => {
			return item.isCorrect ? acc + 1 : acc;
		}, 0)

		const nowIsWin = score >= sortedQuestions.length/2;

		setCalculatedScore(score);
		setIsWin(nowIsWin);
		setUserScore(score, nowIsWin);
	};

	const setUserScore = (userScore: number, win: boolean) => {
		setScore(prev => {
			return [
				...prev,
				{
					timestamp: new Date(),
					score: `${userScore}`,
					questions:`${sortedQuestions.length}`,
					win,
				}
			];
		});
	};

	const clearHistory = () => {
		setScore([]);
	}

	return (
		<QuestionsContext.Provider value={
			{
				sortedQuestions,
				selectedAnswers,
				handleSelectAnswer,
				setIsAnswersShown,
				isAnswersShown,
				clearState,
				calculateScore,
				calculatedScore,
				isWin,
				score,
				clearHistory
			}
		}>
			{children}
		</QuestionsContext.Provider>
	)
}

