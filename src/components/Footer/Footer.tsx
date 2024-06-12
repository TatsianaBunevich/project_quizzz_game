import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
	isScoreboard: boolean;
	setIsScoreboard: (isScoreboard: boolean) => void;
}

const Footer = ({ play, setPlay, isScoreboard, setIsScoreboard }: FooterProps) => {
	const { setIsAnswersShown, isAnswersShown, sortedQuestions, activeQuestionId, setActiveQuestionId, clearQuizState, calculateScore, calculatedScore, isWin, clearScores } = useContext(QuizContext);

	const showAnswers = () => {
		setIsAnswersShown(true);
		calculateScore();
	}

	const setNewTry = () => {
		setPlay(false);
		clearQuizState();
	}

	const submitElement = () => {
		if (!play) {
			return (
				<button className={`${styles.submitButton} ${styles.startButton}`} onClick={() => setPlay(true)}>START</button>
			)
		} else {
			if (!isAnswersShown) {
				const backBtn = <button className={`${styles.submitButton}`} onClick={setNewTry}>Back</button>;
				const prevBtn = <button className={`${styles.submitButton}`} onClick={() => setActiveQuestionId(activeQuestionId - 1)}>
					<span className={`${styles.arrow} ${styles.back}`}></span>
				</button>;
				const nextBtn = <button className={`${styles.submitButton}`} onClick={() => setActiveQuestionId(activeQuestionId + 1)}>
					<span className={`${styles.arrow} ${styles.next}`}></span>
				</button>;
				const checkBtn = <button className={`${styles.submitButton}`} onClick={showAnswers}>Check</button>;

				if (activeQuestionId === 0) {
					return (
						<>
							{backBtn}
							{nextBtn}
						</>
					)
				} else if (activeQuestionId === sortedQuestions.length - 1) {
					return (
						<>
							{prevBtn}
							{checkBtn}
						</>
					)
				} else {
					return (
						<>
							{prevBtn}
							{nextBtn}
						</>
					)
				}
			} else if (isScoreboard) {
				return (
					<>
						<button className={`${styles.submitButton}`} onClick={clearScores}>Clear</button>
						<button className={`${styles.submitButton}`} onClick={() => setIsScoreboard(false)}>Back</button>
					</>
				)
			} else {
				return (
					<>
						<p className={styles.score}>
							<span className={`${isWin ? styles.good : styles.bad}`}>
								{calculatedScore}
							</span>
							/{sortedQuestions.length}
						</p>
						<button className={`${styles.submitButton}`} onClick={setNewTry}>Try again</button>
						<button className={`${styles.submitButton}`} onClick={() => setIsScoreboard(true)}>Scores</button>
						<button className={`${styles.submitButton}`} onClick={setNewTry}>Settings</button>
					</>
				)
			}
		}
	}

	return (
		<footer className={`${styles.footer} ${!isAnswersShown || !play || isScoreboard? '' : styles.answersShown}`}>
			{submitElement()}
		</footer>
	);
};

export default Footer;
