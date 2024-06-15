import { useContext, useState, useCallback } from 'react';
import { GameContext } from '../../context/GameContext';
import styles from './Settings.module.css';
import Setting from '../Setting/Setting';
import Button from '../Button/Button';
import { debounce } from 'lodash';

const Settings = () => {
	const { settings, handleSelectOption } = useContext(GameContext);
	const [categoryClass, setCategoryClass] = useState('');
	const [rangeValue, setRangeValue] = useState(settings.amount);

	const handleOverflow = () => {
		setCategoryClass(styles.overflowHidden);
	};

	const debounceFn = useCallback(debounce((value: number) => handleSelectOption(value, 'amount'), 300), [handleSelectOption]);

	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		setRangeValue(value);
		debounceFn(value);
	}

	return (
		<div className={styles.settings}>
			<Setting title="Category" className={`${styles.category} ${categoryClass}`}>
				<div className={styles.overflow} onClick={handleOverflow}></div>
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
					<input type="range" min="1" max="50" value={rangeValue} className={styles.slider} onChange={handleAmountChange} />
					<div className={styles.sliderValue}>{rangeValue}</div>
				</div>
			</Setting>
		</div>
	);
};

export default Settings;