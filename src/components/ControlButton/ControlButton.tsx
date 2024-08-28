import { Link, LinkProps, To } from 'react-router-dom';
import Button from '../Button/Button';
import stylesButton from '../Button/Button.module.css';
import styles from './ControlButton.module.css';

interface ControlButtonProps {
	to?: To;
	onClick?: () => void;
}

const ControlButton = ({ children, className, to, onClick, ...rest }: ControlButtonProps & (React.ComponentProps<'button'> | LinkProps)) => {
	const Component = to ? Link : Button;

	return (
		<Component
			className={`${to ? stylesButton.button : ''} ${styles.controlButton} ${className ?? ''}`}
			// @ts-expect-error: to
			to={to ?? undefined}
			onClick={onClick ?? undefined}
			{...rest}>
			{children}
		</Component>
	);
};

export default ControlButton;
