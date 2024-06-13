import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import Button from '../Button/Button';
import styles from './Footer.module.css';
import { Page } from '../../types';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
	page: Page;
	setPage: (page: Page) => void;
}

const Footer = ({ play, setPlay, page, setPage }: FooterProps) => {
	const {
		setIsAnswersShown,
		isAnswersShown,
		sortedQuestions,
		activeQuestionId,
		setActiveQuestionId,
		clearQuizState,
		calculateScore,
		clearScores
	} = useContext(QuizContext);

	const handleStartQuiz = () => {
		setPlay(true);
		setPage('quiz');
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
		setPlay(false);
		clearQuizState();
		setPage('quiz');
	}

	const handlePrevButton = () => {
		if (activeQuestionId === 0) {
			handleNewTry();
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
			</>
		)
	}

	const renderSubmitElement = () => {
		if (!play) {
			return <Button className={styles.submitButton} onClick={handleStartQuiz}>START</Button>
		}
		switch(page) {
			case 'quiz':
				return renderQuizButtons();
			case 'result':
				return (
					<>
						<Button className={styles.submitButton} onClick={handleShowAnswers}>Answers</Button>
						<Button className={styles.submitButton} onClick={() => setPage('scoreboard')}>Scores</Button>
						<Button className={styles.submitButton} onClick={handleNewTry}>Try again</Button>
						<Button className={styles.submitButton} onClick={handleNewTry}>Settings</Button>
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

	return (
		<footer className={`${styles.footer} ${isAnswersShown || !play ? styles.footerCentered : ''} ${!play ? styles.start : ''}`}>
			{renderSubmitElement()}
		</footer>
	);
};

export default Footer;