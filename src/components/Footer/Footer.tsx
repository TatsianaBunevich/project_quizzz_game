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
	const { setIsAnswersShown, isAnswersShown, sortedQuestions, clearQuizState, calculateScore, calculatedScore, isWin, clearScores } = useContext(QuizContext);

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
				return (
					<button className={`${styles.submitButton}`} onClick={showAnswers}>Check</button>
				)
			} else if (isScoreboard) {
				return (
					<>
						<button className={`${styles.submitButton} ${styles.backButton}`} onClick={() => setIsScoreboard(false)}>Back</button>
						<button className={`${styles.submitButton}`} onClick={clearScores}>Clear</button>

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
