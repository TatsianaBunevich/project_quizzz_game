import React from 'react';
import styles from './Toggle.module.css';
import { Theme, ThemeProps } from '../../types';

const Toggle: React.FC<ThemeProps> = ({ theme, onSwitchTheme }) => {

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
