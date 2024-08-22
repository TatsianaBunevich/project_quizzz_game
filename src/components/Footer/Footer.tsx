import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import SubmitButton from '../SubmitButton/SubmitButton';
import FooterQuizSkeleton from '../FooterQuizSkeleton/FooterQuizSkeleton';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
	const {
		play,
		page,
		settings,
		sortedQuestions,
		activeQuestionId,
		resetScores,
		isCountdown,
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
	} = useBoundStore(
		useShallow((state) => ({
			play: state.play,
			page: state.page,
			settings: state.settings,
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			resetScores: state.resetScores,
			isCountdown: state.isCountdown,
			handleSettings: state.handleSettings,
			handleStartQuiz: state.handleStartQuiz,
			handleEndQuiz: state.handleEndQuiz,
			handleShowAnswers: state.handleShowAnswers,
			handleAnswersToResult: state.handleAnswersToResult,
			handleShowScoreboard: state.handleShowScoreboard,
			handleScoreboardToResult: state.handleScoreboardToResult,
			handleNewTry: state.handleNewTry,
			handleOpenSettings: state.handleOpenSettings,
			handlePrevButton: state.handlePrevButton,
			handleNextButton: state.handleNextButton,
			handleOpenModal: state.handleOpenModal
		}))
	);

	const renderQuizButtons = () => {
		return (
			!isCountdown ?
				!sortedQuestions.length ? <FooterQuizSkeleton /> :
					<>
						<SubmitButton className={styles.footerButton} onClick={handlePrevButton} disabled={settings.timer > 0 && activeQuestionId > 0}>
							{activeQuestionId === 0 ? 'Back' : <FontAwesomeIcon icon={faChevronLeft} />}
						</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleNextButton}>
							{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <FontAwesomeIcon icon={faChevronRight} />}
						</SubmitButton>
						<SubmitButton className={`${styles.footerButton} ${styles.stopButton}`} onClick={handleOpenModal}>Stop</SubmitButton>
					</> : null
		)
	}

	const renderSubmitElement = () => {
		if (!play) {
			return <SubmitButton className={styles.footerButton} onClick={handleSettings}>START</SubmitButton>
		}
		switch(page) {
			case 'settings': {
				if (settings.category.length === 1) return null;
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={handleStartQuiz}>Let&apos;s go</SubmitButton>
						<SubmitButton className={styles.footerButton} onClick={handleEndQuiz}>Exit</SubmitButton>
					</>
				);
			}
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
			case 'answers':
				return <SubmitButton className={styles.footerButton} onClick={handleAnswersToResult}>Back</SubmitButton>;
			case 'scoreboard':
				return (
					<>
						<SubmitButton className={styles.footerButton} onClick={resetScores}>Clear</SubmitButton>
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
		const answersClass = page === 'answers' ? [styles.answers, styles.footerCentered].join(' ') : '';

		return `${startClass} ${quizClass} ${answersClass}`;
	}

	return (
		<footer className={`${styles.footer} ${footerClasses()}`}>
			{renderSubmitElement()}
		</footer>
	);
};

export default Footer;
