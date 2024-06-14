import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import styles from './Settings.module.css';
import Setting from '../Setting/Setting';
import Button from '../Button/Button';

const Settings = () => {
	const { settings, handleSelectOption } = useContext(GameContext);

	return (
		<div className={styles.settings}>
			<Setting title="Category">
				{settings.category.map((option) => (
					<Button
						key={option.id}
						className={`${styles.option} ${option.isSelect ? styles.selected : ''}`}
						onClick={() => handleSelectOption(option.id, 'category')}>{option.name}
					</Button>
				))}
			</Setting>
			<Setting title="Difficulty">
				{settings.difficulty.map((option) => (
					<Button
						key={option.id}
						className={`${styles.option} ${option.isSelect ? styles.selected : ''}`}
						onClick={() => handleSelectOption(option.id, 'difficulty')}>{option.name}
					</Button>
				))}
			</Setting>
			<Setting title="Type">
				{settings.type.map((option) => (
					<Button
						key={option.id}
						className={`${styles.option} ${option.isSelect ? styles.selected : ''}`}
						onClick={() => handleSelectOption(option.id, 'type')}>{option.name}
					</Button>
				))}
			</Setting>
			<Setting title="Number of Questions">
				<div className={styles.sliderContainer}>
					<input type="range" min="1" max="50" value={settings.amount} className={styles.slider} onChange={(e) => handleSelectOption(Number(e.target.value), 'amount')} />
					<div className={styles.sliderValue}>{settings.amount}</div>
				</div>
			</Setting>
		</div>
	);
};

export default Settings;