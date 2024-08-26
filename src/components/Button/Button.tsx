import styles from './Button.module.css';

const Button = ({ onClick, children, className, ...rest }: React.ComponentProps<'button'>) => {
	return (
		<button className={`${styles.button} ${className ?? ''}`} onClick={onClick} {...rest}>
			{children}
		</button>
	);
};

export default Button;
