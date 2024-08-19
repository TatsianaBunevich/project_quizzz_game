import React, { ButtonHTMLAttributes } from 'react';
import Button from '../Button/Button';
import styles from './AnswerButton.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	children: React.ReactNode;
}

const AnswerButton = ({ onClick, children, className, ...rest }: ButtonProps) => {
	return (
		<Button className={`${styles.answerButton} ${className ?? ''}`} onClick={onClick} {...rest}>
			{children}
		</Button>
	);
};

export default AnswerButton;
