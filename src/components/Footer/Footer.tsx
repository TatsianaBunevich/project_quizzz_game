import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { QuizContext } from '../../context/QuizContext';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './Footer.module.css';
import { Page } from '../../types';
import { defaultSettings } from '../../constants';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
	page: Page;
	setPage: (page: Page) => void;
}

const Footer = ({ play, setPlay, page, setPage }: FooterProps) => {
	const { setSettings, setIsUpdateQuestions } = useContext(GameContext);
	const {
		updateSortedQuestions,
		setIsCountdown,
		setIsModalShown,
		setIsAnswersShown,
		isAnswersShown,
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
		setSettings(structuredClone(defaultSettings));
	}

	const handleCheckAnswers = () => {
		calculateScore();
		setPage('result');
	}

	const handleShowAnswers = () => {
		setIsAnswersShown(true);
		setPage('quiz');
	}

	const handleBackToResult = () => {
		setIsAnswersShown(false);
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

	const openModal = () => {
		setIsModalShown(true);
	}

	const renderQuizButtons = () => {
		if (isAnswersShown) {
			return <SubmitButton className={styles.footerButton} onClick={handleBackToResult}>Back</SubmitButton>
		}

		return (
			<>
				<SubmitButton className={styles.footerButton} onClick={handlePrevButton}>
					{activeQuestionId === 0 ? 'Back' : <span className={`${styles.arrow} ${styles.back}`}></span>}
				</SubmitButton>
				<SubmitButton className={styles.footerButton} onClick={handleNextButton}>
					{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <span className={`${styles.arrow} ${styles.next}`}></span>}
				</SubmitButton>
				<SubmitButton className={`${styles.footerButton} ${styles.stopButton}`} onClick={openModal}>Stop</SubmitButton>
			</>
		)
	}

	const renderSubmitElement = () => {
		if (!play) {
			return <SubmitButton className={styles.footerButton} onClick={handleSettings}>START</SubmitButton>
		}
		switch(page) {
			case 'settings':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={handleStartQuiz}>Let's go</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleEndQuiz}>Exit</SubmitButton>
					</>
				);
			case 'quiz':
				return renderQuizButtons();
			case 'result':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={handleShowAnswers}>Answers</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={() => setPage('scoreboard')}>Scores</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleNewTry}>Try again</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleOpenSettings}>Settings</SubmitButton>
					</>
				);
			case 'scoreboard':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={clearScores}>Clear</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={() => setPage('result')}>Back</SubmitButton>
					</>
				);
			default:
				return null;
		}
	}

	const footerClasses = () => {
		const startClass = !play ? [styles.start, styles.footerCentered].join(' ') : '';
		const quizClass = page === 'quiz' ? styles.quiz : '';
		const allShownClass = isAnswersShown ? [styles.allShown, styles.footerCentered].join(' ') : '';

		return `${startClass} ${quizClass} ${allShownClass}`;
	}
	// TODO: change arrow icons
	return (
		<footer className={`${styles.footer} ${footerClasses()}`}>
			{renderSubmitElement()}
		</footer>
	);
};

export default Footer;