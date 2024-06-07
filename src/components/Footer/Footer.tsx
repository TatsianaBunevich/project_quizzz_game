import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
}

const Footer = ({ play, setPlay }: FooterProps) => {

	const submitElement = () => {
		if (!play) {
			return (
				<button className={`${styles.submitButton} ${styles.startButton}`} onClick={() => setPlay(true)}>Start the Game</button>
			)
		} else {
			// if (selectedAnswers.length === 0) {
			// 	return (
			// 		<button className={`${styles.submitButton}`} onClick={}>Check answers</button>
			// 	)
			// } else {
			return (
				<>
					<p className={styles.score}>You scored 3/5 correct answers</p>
					<button className={`${styles.submitButton}`} onClick={() => setPlay(false)}>Play again</button>
				</>
			)
			// }
		}
	}

	return (
		<footer className={`${play && styles.footer}`}>
			{submitElement()}
		</footer>
	);
};

export default Footer;
