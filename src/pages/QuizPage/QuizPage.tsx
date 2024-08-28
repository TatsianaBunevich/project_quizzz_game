import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '../../components/Fallback/Fallback';
import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import Countdown from '../../components/Countdown/Countdown';
import QuizSkeleton from '../../components/QuizSkeleton/QuizSkeleton';
const Quiz = lazy(() => import('../../components/Quiz/Quiz'));
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import QuestionTimer from '../../components/QuestionTimer/QuestionTimer';
import Modal from '../../components/Modal/Modal';
import styles from './QuizPage.module.css';

const QuizPage = () => {
	const { reset } = useQueryErrorResetBoundary();
	const {
		sortedQuestions,
		activeQuestionId,
		runQuestionTimer,
		handlePrevButton,
		handleNextButton,
		controlCountdown,
		timer,
		getRoundScore,
		resetQuiz,
		stopQuestionTimer,
		restartQuestionTimer
	} = useBoundStore(
		useShallow((state) => ({
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			runQuestionTimer: state.runQuestionTimer,
			handlePrevButton: state.handlePrevButton,
			handleNextButton: state.handleNextButton,
			controlCountdown: state.controlCountdown,
			timer: state.settings.timer,
			getRoundScore: state.getRoundScore,
			resetQuiz: state.resetQuiz,
			stopQuestionTimer: state.stopQuestionTimer,
			restartQuestionTimer: state.restartQuestionTimer
		}))
	);
	const [isCountdown, setIsCountdown] = useState(true);
	const [isModal, setIsModal] = useState(false);
	const progress = useRef<HTMLDivElement>(null);
	const oldLength = useRef(0);
	const newLength = (activeQuestionId) / (sortedQuestions.length - 1) * 100;

	useEffect(() => {
		if (isCountdown) {
			controlCountdown().then(() => setIsCountdown(false)).catch((error) => console.error(error));
		}
	}, [controlCountdown, isCountdown]);

	useEffect(() => {
		if (progress.current) {
			progress.current.style.animation = 'none';
			progress.current.offsetHeight;
			progress.current.style.setProperty("--old-length", `${oldLength.current}%`);
			progress.current.style.setProperty("--new-length", `${newLength}%`);
			progress.current.style.animation = 'progress 0.5s normal forwards';
			oldLength.current = newLength;
		}
	}, [newLength]);

	useEffect(() => {
		if (!isCountdown) {
			if (timer) runQuestionTimer();
		}
	}, [isCountdown, runQuestionTimer, timer]);

	const handleOpenModal = () => {
		if (timer) stopQuestionTimer();
		setIsModal(true);
	};

	const handleCloseModal = () => {
		if (timer) restartQuestionTimer();
		setIsModal(false);
	};

	const handleCheckAnswers = () => {
		getRoundScore();
		setIsModal(false);
	};

	const handleOpenSettings = () => {
		resetQuiz();
		setIsModal(false);
	};

	return (
		<ErrorBoundary
			fallbackRender={Fallback}
			onReset={reset}
		>
			{isCountdown && <Countdown />}
			<div className={`${styles.quizWrap} ${!isCountdown ? styles.active : ''}`}>
				<Suspense fallback={<QuizSkeleton />}>
					<main className={styles.quizItemWrap}>
						<Quiz />
					</main>
					<Footer>
						<ControlButton
							to={activeQuestionId === 0 ? PathConstants.SETTINGS : ''}
							className={styles.footerButton}
							onClick={handlePrevButton}
							disabled={timer > 0 && activeQuestionId > 0}>
							{activeQuestionId === 0 ? 'Back' : <FontAwesomeIcon icon={faChevronLeft} />}
						</ControlButton>
						<ControlButton
							to={activeQuestionId === sortedQuestions.length - 1 ? PathConstants.RESULT : ''}
							className={styles.footerButton}
							onClick={handleNextButton}>
							{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <FontAwesomeIcon icon={faChevronRight} />}
						</ControlButton>
						<ControlButton
							className={`${styles.footerButton} ${styles.stopButton}`}
							onClick={handleOpenModal}>
							Stop
						</ControlButton>
					</Footer>
					<div className={styles.quizProgress} ref={progress}></div>
					{timer > 0 && <QuestionTimer />}
					<Modal isModal={isModal}>
						<h2>Do you want to</h2>
						<ControlButton className={styles.modalButton} onClick={handleCloseModal}>Back to the game</ControlButton>
						<ControlButton className={styles.modalButton} to={PathConstants.RESULT} onClick={handleCheckAnswers}>See the result</ControlButton>
						<ControlButton className={styles.modalButton} to={PathConstants.SETTINGS} onClick={handleOpenSettings}>Go to settings</ControlButton>
					</Modal>
				</Suspense>
			</div>
		</ErrorBoundary>
	);
};

export default QuizPage;
