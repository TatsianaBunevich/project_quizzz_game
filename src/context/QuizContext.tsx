import useBoundStore from '../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useState, useEffect, createContext } from 'react';
import { sortedQuestionsType, Answer, SelectedAnswer, Score, Status } from '../types';

interface QuizContextType {
    sortedQuestions: sortedQuestionsType[];
	updateSortedQuestions: () => void;
	activeQuestionId: number;
	setActiveQuestionId: (activeQuestionId: number) => void;
	isCountdown: boolean;
	setIsCountdown: (isCountdown: boolean) => void;
    selectedAnswers: SelectedAnswer[];
	setIsModalShown: (isModalShown: boolean) => void;
	isModalShown: boolean;
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
	roundTimeCounter: number;
	setRoundTimeCounter: (roundTimeCounter: (c: number) => number) => void;
}

export const QuizContext = createContext<QuizContextType>({
	sortedQuestions: [],
	updateSortedQuestions: () => {},
	activeQuestionId: 0,
	setActiveQuestionId: () => {},
	isCountdown: false,
	setIsCountdown: () => {},
	selectedAnswers: [],
	setIsModalShown: () => {},
	isModalShown: false,
	handleSelectAnswer: () => {},
	setIsAnswersShown: () => {},
	isAnswersShown: false,
	clearQuizState: () => {},
	calculateScore: () => {},
	calculatedScore: 0,
	roundScore: 0,
	roundStatus: Status.NORMAL,
	scores: [],
	clearScores: () => {},
	roundTimeCounter: 0,
	setRoundTimeCounter: () => {}
});

export const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
	const { questions, settings } = useBoundStore(
		useShallow((state) => ({ questions: state.questions, settings: state.settings }))
	);
	const [sortedQuestions, setSortedQuestions] = useState<sortedQuestionsType[]>([]);
	const [activeQuestionId, setActiveQuestionId] = useState(0);
	const [isCountdown, setIsCountdown] = useState(false);
	const [isAnswersShown, setIsAnswersShown] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
	const [isModalShown, setIsModalShown] = useState(false);
	const [calculatedScore, setCalculatedScore] = useState(0);
	const [roundScore, setRoundScore] = useState(0);
	const [roundStatus, setRoundStatus] = useState(Status.NORMAL);
	const [scores, setScores] = useState<Score[]>([]);
	const [roundTimeCounter, setRoundTimeCounter] = useState(0);

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
			],
			timer: settings.timer
		}));

		setSortedQuestions(sortAnswers(mappedQuestions));

	}, [questions, settings.timer]);

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
		setRoundTimeCounter(0);
	}

	const calculateScore = () => {
		const points = selectedAnswers.reduce((acc, item) => {
			return item.isCorrect ? acc + 1 : acc;
		}, 0);
		const goal = sortedQuestions.length;
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
		setTotalScore(total, calculateStatus(percentage), roundTimeCounter);
	};

	const setTotalScore = (total: number, status: Status, roundTimeCounter: number) => {
		setScores(prev => {
			return [
				...prev,
				{
					index: prev.length + 1,
					total,
					status,
					time: roundTimeCounter
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
				isCountdown,
				setIsCountdown,
				selectedAnswers,
				handleSelectAnswer,
				setIsModalShown,
				isModalShown,
				setIsAnswersShown,
				isAnswersShown,
				clearQuizState,
				calculateScore,
				calculatedScore,
				roundScore,
				roundStatus,
				scores,
				clearScores,
				roundTimeCounter,
				setRoundTimeCounter,
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
