import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	children: React.ReactNode;
}

const Button = ({ onClick, children, className, ...rest }: ButtonProps) => {
	return (
		<button className={`${styles.button} ${className ?? ''}`} onClick={onClick} {...rest}>
			{children}
		</button>
	);
};

export default Button;
