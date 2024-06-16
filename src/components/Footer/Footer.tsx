import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { QuizContext } from '../../context/QuizContext';
import Button from '../Button/Button';
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
	}

	const handleEndQuiz = () => {
		setPlay(false);
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

	const handleNewTry = (isNewTry: boolean) => {
		clearQuizState();
		isNewTry && updateSortedQuestions();
		setPage(isNewTry ? 'quiz' : 'settings');
	}

	const handlePrevButton = () => {
		if (activeQuestionId === 0) {
			handleNewTry(false);
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

	const renderQuizButtons = () => {
		if (isAnswersShown) {
			// TODO: show Back button always at the bottom
			return <Button className={styles.submitButton} onClick={handleBackToResult}>Back</Button>
		}

		return (
			<>
				<Button className={styles.submitButton} onClick={handlePrevButton}>
					{activeQuestionId === 0 ? 'Back' : <span className={`${styles.arrow} ${styles.back}`}></span>}
				</Button>
				<Button className={styles.submitButton} onClick={handleNextButton}>
					{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <span className={`${styles.arrow} ${styles.next}`}></span>}
				</Button>
				<Button className={`${styles.submitButton} ${styles.stopButton}`} onClick={handleCheckAnswers}>Stop</Button>
			</>
		)
	}

	const renderSubmitElement = () => {
		if (!play) {
			return <Button className={styles.submitButton} onClick={handleSettings}>START</Button>
		}
		switch(page) {
			case 'settings':
				return (
					<>
						<Button className={styles.submitButton} onClick={handleStartQuiz}>Let's go</Button>
						<Button className={styles.submitButton} onClick={handleEndQuiz}>Exit</Button>
					</>
				);
			case 'quiz':
				return renderQuizButtons();
			case 'result':
				return (
					<>
						<Button className={styles.submitButton} onClick={handleShowAnswers}>Answers</Button>
						<Button className={styles.submitButton} onClick={() => setPage('scoreboard')}>Scores</Button>
						<Button className={styles.submitButton} onClick={() => handleNewTry(true)}>Try again</Button>
						<Button className={styles.submitButton} onClick={() => handleNewTry(false)}>Settings</Button>
					</>
				);
			case 'scoreboard':
				return (
					<>
						<Button className={styles.submitButton} onClick={clearScores}>Clear</Button>
						<Button className={styles.submitButton} onClick={() => setPage('result')}>Back</Button>
					</>
				);
			default:
				return null;
		}
	}
	// TODO: change arrow icons
	return (
		<footer className={`${styles.footer} ${!play || isAnswersShown ? styles.footerCentered : ''} ${!play ? styles.start : ''} ${page === 'quiz' ? styles.quiz : ''}`}>
			{renderSubmitElement()}
		</footer>
	);
};

export default Footer;