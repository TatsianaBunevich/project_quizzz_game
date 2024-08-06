import useBoundStore from '../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { createContext, useContext } from 'react';
import { QuizContext } from './QuizContext';

interface ControlsContextProviderProps {
	children: React.ReactNode;
}

interface ControlsContextType {
	handleSettings: () => Promise<void>;
	handleStartQuiz: () => Promise<void>;
	handleEndQuiz: () => void;
	handleCheckAnswers: () => void;
	handleShowAnswers: () => void;
	handleAnswersToResult: () => void;
	handleShowScoreboard: () => void;
	handleScoreboardToResult: () => void;
	handleNewTry: () => void;
	handleOpenSettings: () => void;
	handlePrevButton: () => void;
	handleNextButton: () => void;
	handleOpenModal: () => void;
	handleCloseModal: () => void;
}

export const ControlsContext = createContext<ControlsContextType>({
	handleSettings: () => Promise.resolve(),
	handleStartQuiz: () => Promise.resolve(),
	handleEndQuiz: () => {},
	handleCheckAnswers: () => {},
	handleShowAnswers: () => {},
	handleAnswersToResult: () => {},
	handleShowScoreboard: () => {},
	handleScoreboardToResult: () => {},
	handleNewTry: () => {},
	handleOpenSettings: () => {},
	handlePrevButton: () => {},
	handleNextButton: () => {},
	handleOpenModal: () => {},
	handleCloseModal: () => {}
});

export const ControlsContextProvider = ({ children }: ControlsContextProviderProps) => {
	const {
		togglePlay,
		setPage,
		updateSettings,
		getQuestions,
		createSortedQuestions,
		sortedQuestions,
		activeQuestionId,
		updateSortedQuestions,
		incActiveQuestionId,
		decActiveQuestionId,
		setIsAnswersShown,
		calculateScore,
		resetQuizStateExcept,
		resetBoundStore
	} = useBoundStore(
		useShallow((state) => ({
			togglePlay: state.togglePlay,
			setPage: state.setPage,
			updateSettings: state.updateSettings,
			getQuestions: state.getQuestions,
			createSortedQuestions: state.createSortedQuestions,
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			updateSortedQuestions: state.updateSortedQuestions,
			incActiveQuestionId: state.incActiveQuestionId,
			decActiveQuestionId: state.decActiveQuestionId,
			setIsAnswersShown: state.setIsAnswersShown,
			calculateScore: state.calculateScore,
			resetQuizStateExcept: state.resetQuizStateExcept,
			resetBoundStore: state.resetBoundStore
		}))
	);
	const {
		setIsCountdown,
		setIsModalShown,
	} = useContext(QuizContext);

	const handleSettings = async () => {
		togglePlay();
		setPage('settings');
		await updateSettings();
	}

	const handleStartQuiz = async () => {
		setPage('quiz');
		setIsCountdown(true);
		await getQuestions();
		createSortedQuestions();
	}

	const handleEndQuiz = () => {
		resetBoundStore();
	}

	const handleCheckAnswers = () => {
		calculateScore();
		setIsModalShown(false);
		setPage('result');
	}

	const handleShowAnswers = () => {
		setIsAnswersShown(true);
		setPage('quiz');
	}

	const handleAnswersToResult = () => {
		setIsAnswersShown(false);
		setPage('result');
	}

	const handleShowScoreboard = () => {
		setPage('scoreboard');
	}

	const handleScoreboardToResult = () => {
		setPage('result');
	}

	const handleNewTry = () => {
		resetQuizStateExcept('questions', 'sortedQuestions', 'scores');
		updateSortedQuestions();
		setIsCountdown(true);
		setPage('quiz');
	}

	const handleOpenSettings = () => {
		resetQuizStateExcept('scores');
		setIsModalShown(false);
		setPage('settings');
	}

	const handlePrevButton = () => {
		if (activeQuestionId === 0) {
			handleOpenSettings();
		} else {
			decActiveQuestionId();
		}
	}

	const handleNextButton = () => {
		if (activeQuestionId === sortedQuestions.length - 1) {
			handleCheckAnswers();
		} else {
			incActiveQuestionId();
		}
	}

	const handleOpenModal = () => {
		setIsModalShown(true);
	}

	const handleCloseModal = () => {
		setIsModalShown(false);
	}

	return (
		<ControlsContext.Provider value={
			{
				handleSettings,
				handleStartQuiz,
				handleEndQuiz,
				handleCheckAnswers,
				handleShowAnswers,
				handleAnswersToResult,
				handleShowScoreboard,
				handleScoreboardToResult,
				handleNewTry,
				handleOpenSettings,
				handlePrevButton,
				handleNextButton,
				handleOpenModal,
				handleCloseModal
			}
		}>
			{children}
		</ControlsContext.Provider>
	)
}

