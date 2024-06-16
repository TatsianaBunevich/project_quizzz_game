import { useState, useEffect, createContext, useContext } from 'react';
import { GameContext } from './GameContext';
import { sortedQuestionsType, Answer, SelectedAnswer, Score, Status } from '../types';

type QuizContextType = {
    sortedQuestions: sortedQuestionsType[];
	updateSortedQuestions: () => void;
	activeQuestionId: number;
	setActiveQuestionId: (activeQuestionId: number) => void;
    selectedAnswers: SelectedAnswer[];
	handleSelectAnswer: (question: string, a: Answer) => void;
	setIsAnswersShown: (isAnswersShown: boolean) => void;
	isAnswersShown: boolean;
	clearQuizState: () => void;
	calculateScore: () => void;
	calculatedScore: number;
	roundScore: number;
	roundStatus: Status;
	scores: Score[];
	clearScores: () => void;
}

export const QuizContext = createContext<QuizContextType>({
	sortedQuestions: [],
	updateSortedQuestions: () => {},
	activeQuestionId: 0,
	setActiveQuestionId: () => {},
	selectedAnswers: [],
	handleSelectAnswer: () => {},
	setIsAnswersShown: () => {},
	isAnswersShown: false,
	clearQuizState: () => {},
	calculateScore: () => {},
	calculatedScore: 0,
	roundScore: 0,
	roundStatus: Status.NORMAL,
	scores: [],
	clearScores: () => {}
});

export const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
	const { questions } = useContext(GameContext);
	const [sortedQuestions, setSortedQuestions] = useState<sortedQuestionsType[]>([]);
	const [activeQuestionId, setActiveQuestionId] = useState(0);
	const [isAnswersShown, setIsAnswersShown] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
	const [calculatedScore, setCalculatedScore] = useState(0);
	const [roundScore, setRoundScore] = useState(0);
	const [roundStatus, setRoundStatus] = useState(Status.NORMAL);
	const [scores, setScores] = useState<Score[]>([]);
	// TODO: set timer when start quiz (3...2...1...GO!)

	useEffect(() => {
		const mappedQuestions = questions.map(q => ({
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
			]
		}));

		setSortedQuestions(sortAnswers(mappedQuestions));

	}, [questions]);

	const updateSortedQuestions = () => {
		setSortedQuestions(sortAnswers(sortedQuestions));
	};

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
		setActiveQuestionId(0);
		setIsAnswersShown(false);
		setSelectedAnswers([]);
		setCalculatedScore(0);
		setRoundScore(0);
	}

	const calculateScore = () => {
		const goal = sortedQuestions.length;
		const points = selectedAnswers.reduce((acc, item) => {
			return item.isCorrect ? acc + 1 : acc;
		}, 0);

		const percentage = (points / goal) * 100;
		const total = Number(percentage.toFixed(0));

		const calculateStatus = (percentage: number) => {
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
		setRoundScore(total);
		setRoundStatus(calculateStatus(percentage));
		setTotalScore(total, calculateStatus(percentage));
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
				updateSortedQuestions,
				activeQuestionId,
				setActiveQuestionId,
				selectedAnswers,
				handleSelectAnswer,
				setIsAnswersShown,
				isAnswersShown,
				clearQuizState,
				calculateScore,
				calculatedScore,
				roundScore,
				roundStatus,
				scores,
				clearScores
			}
		}>
			{children}
		</QuizContext.Provider>
	)
}

const sortAnswers = (questions: sortedQuestionsType[]) => {
	return structuredClone(questions).map(item => ({
		...item,
		answers: item.answers.sort(() => Math.random() - 0.5)
	}));
}