import styles from './Toggle.module.css';
import { Theme } from '../../types';

interface ToggleProps {
	theme: Theme;
	onSwitchTheme: (theme: Theme) => void;
}

const Toggle = ({ theme, onSwitchTheme }: ToggleProps) => {

	return (
		<div className={styles.toggle}>
			<input
				type="checkbox"
				id="toggle"
				className={styles.toggleCheckbox}
				checked={theme === Theme.DARK}
				onChange={() => onSwitchTheme(theme)}
			/>
			<label htmlFor="toggle" className={styles.toggleLabel}>
				<span className={styles.toggleLabelBackground}></span>
			</label>
		</div>
	);
};

export default Toggle;
