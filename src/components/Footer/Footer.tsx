import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
}

const Footer = ({ play, setPlay }: FooterProps) => {
	return (
		<footer className={styles.footer}>
			<button className={`${styles.submitButton} ${!play && styles.startButton}`} onClick={() => setPlay(!play)}>{play ? 'Check answers' : 'Start the Game'}</button>
		</footer>
	);
};

export default Footer;
