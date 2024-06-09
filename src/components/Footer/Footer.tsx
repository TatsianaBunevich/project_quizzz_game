import { useContext } from 'react';
import { QuestionsContext } from '../../context/questionsContext';
import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
}

const Footer = ({ play, setPlay }: FooterProps) => {
	const { setIsAnswersShown, isAnswersShown, sortedQuestions, selectedAnswers, clearState } = useContext(QuestionsContext);

	const showAnswers = () => {
		setIsAnswersShown(true);
	}

	const calculateScore = () => {
		return selectedAnswers.reduce((acc, item) => {
			return item.isCorrect ? acc + 1 : acc;
		}, 0);
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
			} else {
				return (
					<>
						<p className={styles.score}>
							<span className={`${calculateScore() >= sortedQuestions.length/2 ? styles.win : styles.lose}`}>
								{calculateScore()}
							</span>
							/{sortedQuestions.length}
						</p>
						<button className={`${styles.submitButton}`} onClick={() => {setPlay(false); clearState()}}>Try again</button>
						<button className={`${styles.submitButton}`} onClick={() => setPlay(false)}>History</button>
						<button className={`${styles.submitButton}`} onClick={() => setPlay(false)}>Settings</button>
					</>
				)
			}
		}
	}

	return (
		<footer className={`${styles.footer} ${isAnswersShown ? styles.answersShown : ''}`}>
			{submitElement()}
		</footer>
	);
};

export default Footer;
