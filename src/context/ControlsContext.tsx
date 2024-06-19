import { createContext, useContext } from 'react';
import { GameContext } from './GameContext';
import { QuizContext } from './QuizContext';
import { Page } from '../types';
import { DEFAULTSETTINGS } from '../constants';

type ControlsContextProviderProps = {
	setPlay: (play: boolean) => void;
	setPage: (page: Page) => void;
	children: React.ReactNode;
}

type ControlsContextType = {
	handleSettings: () => void;
	handleStartQuiz: () => void;
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
	handleSettings: () => {},
	handleStartQuiz: () => {},
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

export const ControlsContextProvider = ({ setPlay, setPage, children }: ControlsContextProviderProps) => {
	const { setSettings, setIsUpdateQuestions } = useContext(GameContext);
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

	const handleSettings = () => {
		setPlay(true);
		setPage('settings');
	}

	const handleStartQuiz = () => {
		setIsUpdateQuestions(true);
		setPage('quiz');
		setIsCountdown(true);
	}

	const handleEndQuiz = () => {
		setPlay(false);
		clearScores();
		setSettings(structuredClone(DEFAULTSETTINGS));
	}

	const handleCheckAnswers = () => {
		calculateScore();
		setIsModalShown(false); // TODO: need condition?
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
		setIsModalShown(false); // TODO: need condition?
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
		// TODO: stop roundTimeCounter
		setIsModalShown(true);
	}

	const handleCloseModal = () => {
		// TODO: run roundTimeCounter
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

