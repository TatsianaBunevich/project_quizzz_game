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
		sortedQuestions,
		activeQuestionId,
		getQuestions,
		sortQuestions,
		incActiveQuestionId,
		decActiveQuestionId,
		setIsAnswersShown,
		calculateScore,
		resetPartialQuizState,
		toggleCountdown,
		setIsModal,
		resetBoundStore
	} = useBoundStore(
		useShallow((state) => ({
			togglePlay: state.togglePlay,
			setPage: state.setPage,
			updateSettings: state.updateSettings,
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			getQuestions: state.getQuestions,
			sortQuestions: state.sortQuestions,
			incActiveQuestionId: state.incActiveQuestionId,
			decActiveQuestionId: state.decActiveQuestionId,
			setIsAnswersShown: state.setIsAnswersShown,
			calculateScore: state.calculateScore,
			resetPartialQuizState: state.resetPartialQuizState,
			toggleCountdown: state.toggleCountdown,
			setIsModal: state.setIsModal,
			resetBoundStore: state.resetBoundStore
		}))
	);

	const handleSettings = async () => {
		togglePlay();
		setPage('settings');
		await updateSettings();
	}

	const handleStartQuiz = async () => {
		setPage('quiz');
		toggleCountdown();
		await getQuestions();
		sortQuestions();
	}

	const handleEndQuiz = () => {
		resetBoundStore();
	}

	const handleCheckAnswers = () => {
		calculateScore();
		setIsModal(false);
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
		resetPartialQuizState('questions', 'sortedQuestions', 'scores');
		sortQuestions();
		setPage('quiz');
		toggleCountdown();
	}

	const handleOpenSettings = () => {
		resetPartialQuizState('scores');
		setIsModal(false);
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
		setIsModal(true);
	}

	const handleCloseModal = () => {
		setIsModal(false);
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

