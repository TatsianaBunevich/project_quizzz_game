import React, { ButtonHTMLAttributes } from 'react';
import Button from '../Button/Button';
import styles from './SubmitButton.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	children: React.ReactNode;
}

const SubmitButton = ({ onClick, children, className, ...rest }: ButtonProps) => {
	return (
		<Button className={`${styles.submitButton} ${className}`} onClick={onClick} {...rest}>
			{children}
		</Button>
	);
};

export default SubmitButton;