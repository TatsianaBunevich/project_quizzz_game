import useBoundStore from '../../store/boundStore';
import styles from './Toggle.module.css';
import { Theme } from '../../types';

const Toggle = () => {
	const theme = useBoundStore((state) => state.theme);
	const switchTheme = useBoundStore((state) => state.switchTheme);

	return (
		<div className={styles.toggle}>
			<input
				type="checkbox"
				id="toggle"
				className={styles.toggleCheckbox}
				checked={theme === Theme.DARK}
				onChange={() => switchTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
			/>
			<label htmlFor="toggle" className={styles.toggleLabel}>
				<span className={styles.toggleLabelBackground}></span>
			</label>
		</div>
	);
};

export default Toggle;
