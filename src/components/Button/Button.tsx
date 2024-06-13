import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	children: React.ReactNode;
}

const Button = ({ onClick, children, className, ...rest }: ButtonProps) => {
	return (
		<button className={className} onClick={onClick} {...rest}>
			{children}
		</button>
	);
};

export default Button;