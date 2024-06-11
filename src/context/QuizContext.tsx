import { useState, useEffect, createContext } from 'react';
import { Question, sortedQuestionsType, Answer, SelectedAnswer, Score, Status } from '../types';

type QuizContextType = {
    sortedQuestions: sortedQuestionsType[];
    selectedAnswers: SelectedAnswer[];
	handleSelectAnswer: (question: string, a: Answer) => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
	isAnswersShown: boolean;
	clearQuizState: () => void;
	calculateScore: () => void;
	calculatedScore: number;
	isWin: boolean;
	scores: Score[];
	clearScores: () => void;
}

export const QuizContext = createContext<QuizContextType>({
	sortedQuestions: [],
	selectedAnswers: [],
	handleSelectAnswer: () => {},
	setIsAnswersShown: () => {},
	isAnswersShown: false,
	clearQuizState: () => {},
	calculateScore: () => {},
	calculatedScore: 0,
	isWin: false,
	scores: [],
	clearScores: () => {}
});

export const QuizContextProvider = ({ children, questions }: { children: React.ReactNode, questions: Question[] }) => {
	const [sortedQuestions, setSortedQuestions] = useState<sortedQuestionsType[]>([]);
	const [isAnswersShown, setIsAnswersShown] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
	const [calculatedScore, setCalculatedScore] = useState(0);
	const [isWin, setIsWin] = useState(false);
	const [scores, setScores] = useState<Score[]>([]);

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

	const clearQuizState = () => {
		setIsAnswersShown(false);
		setSelectedAnswers([]);
		setCalculatedScore(0);
		setIsWin(false);
	}

	const calculateScore = () => {
		const goal = sortedQuestions.length;
		const points = selectedAnswers.reduce((acc, item) => {
			return item.isCorrect ? acc + 1 : acc;
		}, 0);

		const nowIsWin = points >= goal/2;
		const percentage = Number(((points / goal) * 100).toFixed(0));

		const setStatus = (percentage: number) => {
			const step = 100 / 3;
			if (percentage >= step * 2) {
				return Status.GOOD;
			} else if (percentage >= step) {
				return Status.NORMAL;
			} else {
				return Status.BAD;
			}
		}

		setCalculatedScore(points);
		setIsWin(nowIsWin);
		setTotalScore(percentage, setStatus(percentage));
	};

	const setTotalScore = (total: number, status: Status) => {
		setScores(prev => {
			return [
				...prev,
				{
					index: prev.length + 1,
					total,
					status
				}
			];
		});
	};

	const clearScores = () => {
		setScores([]);
	}

	return (
		<QuizContext.Provider value={
			{
				sortedQuestions,
				selectedAnswers,
				handleSelectAnswer,
				setIsAnswersShown,
				isAnswersShown,
				clearQuizState,
				calculateScore,
				calculatedScore,
				isWin,
				scores,
				clearScores
			}
		}>
			{children}
		</QuizContext.Provider>
	)
}

