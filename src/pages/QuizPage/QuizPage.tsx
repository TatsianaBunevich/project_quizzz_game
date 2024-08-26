import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '../../components/Fallback/Fallback';
import { lazy, Suspense, useEffect, useState } from 'react';
import Countdown from '../../components/Countdown/Countdown';
import QuizSkeleton from '../../components/QuizSkeleton/QuizSkeleton';
const Quiz = lazy(() => import('../../components/Quiz/Quiz'));
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './QuizPage.module.css';

const QuizPage = () => {
	const { reset } = useQueryErrorResetBoundary();
	const {
		sortedQuestions,
		activeQuestionId,
		handlePrevButton,
		handleNextButton,
		controlCountdown,
		timer,
		handleOpenModal
	} = useBoundStore(
		useShallow((state) => ({
			sortedQuestions: state.sortedQuestions,
			activeQuestionId: state.activeQuestionId,
			handlePrevButton: state.handlePrevButton,
			handleNextButton: state.handleNextButton,
			controlCountdown: state.controlCountdown,
			timer: state.settings.timer,
			handleOpenModal: state.handleOpenModal
		}))
	);
	const [isCountdown, setIsCountdown] = useState(true);

	useEffect(() => {
		if (isCountdown) {
			controlCountdown().then(() => setIsCountdown(false)).catch((error) => console.error(error));
		}
	}, [controlCountdown, isCountdown]);

	return (
		<ErrorBoundary
			fallbackRender={Fallback}
			onReset={reset}
		>
			{isCountdown && <Countdown isCountdown={isCountdown} />}
			<div className={`${styles.quizWrap} ${!isCountdown ? styles.active : ''}`}>
				<Suspense fallback={<QuizSkeleton />}>
					<main className={styles.quizItemWrap}>
						<Quiz isCountdown={isCountdown} />
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
							className={styles.footerButton} onClick={handleNextButton}>
							{activeQuestionId === sortedQuestions.length - 1 ? 'Check' : <FontAwesomeIcon icon={faChevronRight} />}
						</ControlButton>
						<ControlButton
							className={`${styles.footerButton} ${styles.stopButton}`}
							onClick={handleOpenModal}>
							Stop
						</ControlButton>
					</Footer>
				</Suspense>
			</div>
		</ErrorBoundary>
	);
};

export default QuizPage;
