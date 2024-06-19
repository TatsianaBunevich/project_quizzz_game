import { useContext, useState, useCallback } from 'react';
import { SettingsType } from '../../types';
import { GameContext } from '../../context/GameContext';
import SettingSkeleton from '../SettingSkeleton/SettingSkeleton';
import Setting from '../Setting/Setting';
import Button from '../Button/Button';
import { secondsToHms } from '../../helpers';
import styles from './Settings.module.css';
import { debounce } from 'lodash';

const Settings = () => {
	const { isLoading, settings, handleSelectOption } = useContext(GameContext);
	const [categoryClass, setCategoryClass] = useState('');
	const [rangeValue, setRangeValue] = useState(settings.amount);
	const [timerValue, setTimerValue] = useState(settings.timer);
	const [isTimer, setIsTimer] = useState(settings.timer === 0 ? false : true);

	const handleOverflow = () => {
		setCategoryClass(styles.overflowHidden);
	};

	const debounceFn = useCallback(debounce((value: number, setting: keyof SettingsType) => handleSelectOption(value, setting), 300), [handleSelectOption]);

	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		setRangeValue(value);
		debounceFn(value, 'amount');
	}

	const handleTimer = () => {
		const newTimerValue = isTimer ? 0 : 10;
		setTimerValue(newTimerValue);
		debounceFn(newTimerValue, 'timer');
		setIsTimer(!isTimer);
	}

	const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		setTimerValue(value);
		debounceFn(value, 'timer');
	}

	if (isLoading) {
		return (
			<div className={styles.settings}>
				<SettingSkeleton />
			</div>
		)
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
					<input id="amount" type="range" min="1" max="50" value={rangeValue} className={styles.slider} onChange={handleAmountChange} />
					<div className={styles.sliderValue}>{rangeValue}</div>
				</div>
			</Setting>
			<Setting title="Timer (per question)">
				<div className={styles.sliderContainer}>
					<input id="timerCheckbox" type="checkbox" checked={isTimer} className={styles.checkbox} onChange={handleTimer} />
					<input id="timer" type="range" disabled={!isTimer} min="10" max="120" value={timerValue} step="10" className={styles.slider} onChange={handleTimerChange} />
					<div className={styles.sliderValue}>{secondsToHms(timerValue)}</div>
				</div>
			</Setting>
		</div>
	);
};

export default Settings;