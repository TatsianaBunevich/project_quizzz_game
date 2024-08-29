import styles from './Footer.module.css';

const Footer = ({ children, className }: React.ComponentProps<'footer'>) => {
	return (
		<footer className={`${styles.footer} ${className ?? ''}`}>
			{children}
		</footer>
	);
};

export default Footer;
