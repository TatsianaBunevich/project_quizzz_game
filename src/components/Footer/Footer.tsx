import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC<{ play: boolean, setPlay: (play: boolean) => void }> = ({ play, setPlay }) => {
	return (
		<footer className={styles.footer}>
			<button className={styles.submitButton} onClick={() => setPlay(!play)}>{play ? 'Check answers' : 'Start the Game'}</button>
		</footer>
	);
};

export default Footer;
