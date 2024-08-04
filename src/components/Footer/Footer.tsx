import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { ControlsContext } from '../../context/ControlsContext';
import SubmitButton from '../SubmitButton/SubmitButton';
import FooterQuizSkeleton from '../FooterQuizSkeleton/FooterQuizSkeleton';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
	const {
		play,
		page,
		isLoading,
		settings
	} = useBoundStore(
		useShallow((state) => ({
			play: state.play,
			page: state.page,
			isLoading: state.isLoading,
			settings: state.settings
		}))
	);
	const {
		isCountdown,
		isAnswersShown,
		sortedQuestions,
		activeQuestionId,
		clearScores
	} = useContext(QuizContext);
	const {
		handleSettings,
		handleStartQuiz,
		handleEndQuiz,
		handleShowAnswers,
		handleAnswersToResult,
		handleShowScoreboard,
		handleScoreboardToResult,
		handleNewTry,
		handleOpenSettings,
		handlePrevButton,
		handleNextButton,
		handleOpenModal
	} = useContext(ControlsContext);

	const renderQuizButtons = () => {
		if (isAnswersShown) {
			return <SubmitButton className={styles.footerButton} onClick={handleAnswersToResult}>Back</SubmitButton>
		} else if (!isCountdown) {
			return (
				isLoading ? <FooterQuizSkeleton /> :
					<>
						<SubmitButton className={styles.footerButton} onClick={handlePrevButton} disabled={settings.timer > 0 && activeQuestionId > 0}>
							{activeQuestionId === 0 ? 'Back' : <FontAwesomeIcon icon={faChevronLeft} />}
						</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleNextButton}>
							{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <FontAwesomeIcon icon={faChevronRight} />}
						</SubmitButton>
						<SubmitButton className={`${styles.footerButton} ${styles.stopButton}`} onClick={handleOpenModal}>Stop</SubmitButton>
					</>
			)
		}
	}

	const renderSubmitElement = () => {
		if (!play) {
			return <SubmitButton className={styles.footerButton} onClick={handleSettings}>START</SubmitButton>
		}
		switch(page) {
			case 'settings':
				if (isLoading) return null;
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={handleStartQuiz}>Let&apos;s go</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleEndQuiz}>Exit</SubmitButton>
					</>
				);
			case 'quiz':
				return renderQuizButtons();
			case 'result':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={handleShowAnswers}>Answers</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleShowScoreboard}>Scores</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleNewTry}>Try again</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleOpenSettings}>Settings</SubmitButton>
					</>
				);
			case 'scoreboard':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={clearScores}>Clear</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleScoreboardToResult}>Back</SubmitButton>
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

	return (
		<footer className={`${styles.footer} ${footerClasses()}`}>
			{renderSubmitElement()}
		</footer>
	);
};

export default Footer;