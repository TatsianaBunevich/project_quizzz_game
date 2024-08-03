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
		setPlay,
		updateSettings,
		updateQuestions,
		resetGameState,
		setPage
	} = useBoundStore(
		useShallow((state) => ({
			setPlay: state.setPlay,
			updateSettings: state.updateSettings,
			updateQuestions: state.updateQuestions,
			resetGameState: state.resetGameState,
			setPage: state.setPage
		}))
	);
	const {
		updateSortedQuestions,
		setIsCountdown,
		setIsModalShown,
		setIsAnswersShown,
		sortedQuestions,
		activeQuestionId,
		setActiveQuestionId,
		clearQuizState,
		calculateScore,
		clearScores
	} = useContext(QuizContext);

	const handleSettings = async () => {
		setPlay(true);
		await updateSettings();
		setPage('settings');
	}

	const handleStartQuiz = async () => {
		await updateQuestions();
		setPage('quiz');
		setIsCountdown(true);
	}

	const handleEndQuiz = () => {
		setPlay(false);
		clearScores();
		resetGameState();
		setPage(null);
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
		clearQuizState();
		updateSortedQuestions();
		setIsCountdown(true);
		setPage('quiz');
	}

	const handleOpenSettings = () => {
		clearQuizState();
		setIsModalShown(false);
		setPage('settings');
	}

	const handlePrevButton = () => {
		if (activeQuestionId === 0) {
			handleOpenSettings();
		} else {
			setActiveQuestionId(activeQuestionId - 1);
		}
	}

	const handleNextButton = () => {
		if (activeQuestionId === sortedQuestions.length - 1) {
			handleCheckAnswers();
		} else {
			setActiveQuestionId(activeQuestionId + 1);
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

