import { useContext } from 'react';
import { QuestionsContext } from '../../context/questionsContext';
import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
	isHistory: boolean;
	setIsHistory: (isHistory: boolean) => void;
}

const Footer = ({ play, setPlay, isHistory, setIsHistory }: FooterProps) => {
	const { setIsAnswersShown, isAnswersShown, sortedQuestions, clearState, calculateScore, calculatedScore, isWin, clearHistory } = useContext(QuestionsContext);

	const showAnswers = () => {
		setIsAnswersShown(true);
		calculateScore();
	}

	const setNewTry = () => {
		setPlay(false);
		clearState();
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
			} else if (isHistory) {
				return (
					<>
						<button className={`${styles.submitButton} ${styles.backButton}`} onClick={() => setIsHistory(false)}>Back</button>
						<button className={`${styles.submitButton}`} onClick={clearHistory}>Clear</button>

					</>
				)
			} else {
				return (
					<>
						<p className={styles.score}>
							<span className={`${isWin ? styles.win : styles.lose}`}>
								{calculatedScore}
							</span>
							/{sortedQuestions.length}
						</p>
						<button className={`${styles.submitButton}`} onClick={setNewTry}>Try again</button>
						<button className={`${styles.submitButton}`} onClick={() => setIsHistory(true)}>History</button>
						<button className={`${styles.submitButton}`} onClick={() => setPlay(false)}>Settings</button>
					</>
				)
			}
		}
	}

	return (
		<footer className={`${styles.footer} ${!isAnswersShown || !play || isHistory? '' : styles.answersShown}`}>
			{submitElement()}
		</footer>
	);
};

export default Footer;
