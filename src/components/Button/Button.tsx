import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	children: React.ReactNode;
}

const Button = ({ onClick, children, className, ...rest }: ButtonProps) => {
	return (
		<button className={cn(className)} onClick={onClick} {...rest}>
			{children}
		</button>
	);
};

export default Button;