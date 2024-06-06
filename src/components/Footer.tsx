import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
	return (
		<footer className={styles.footer}>
			<button className={styles.submitButton}>Check answers</button>
		</footer>
	);
};

export default Footer;
