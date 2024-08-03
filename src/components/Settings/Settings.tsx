import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useState, useMemo } from 'react';
import { SettingsType } from '../../types';
import Setting from '../Setting/Setting';
import Button from '../Button/Button';
import { secondsToHms } from '../../helpers';
import styles from './Settings.module.css';
import { debounce } from 'lodash';

const Settings = () => {
	const { settings, handleSelectOption } = useBoundStore(
		useShallow((state) => ({ settings: state.settings, handleSelectOption: state.handleSelectOption }))
	);
	const [categoryClass, setCategoryClass] = useState('');
	const [rangeValue, setRangeValue] = useState(settings.amount);
	const [timerValue, setTimerValue] = useState(settings.timer);
	const [isTimer, setIsTimer] = useState(settings.timer === 0 ? false : true);

	const handleOverflow = () => {
		setCategoryClass(styles.overflowHidden);
	};

	const debounceFn = useMemo(() => debounce((value: number, setting: keyof SettingsType) => handleSelectOption(value, setting), 300), [handleSelectOption]);

	const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, type: keyof SettingsType) => {
		const value = Number(event.target.value);
		if (type === 'amount') {
			setRangeValue(value);
		} else {
			setTimerValue(value);
		}
		debounceFn(value, type);
	};

	const handleCheckboxChange = () => {
		const newTimerValue = isTimer ? 0 : 10;
		setTimerValue(newTimerValue);
		debounceFn(newTimerValue, 'timer');
		setIsTimer(!isTimer);
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
					<input id="amount" type="range" min="1" max="50" value={rangeValue} className={styles.slider} onChange={(e) => handleSliderChange(e, 'amount')} />
					<div className={styles.sliderValue}>{rangeValue}</div>
				</div>
			</Setting>
			<Setting title="Timer (per question)">
				<div className={styles.sliderContainer}>
					<input id="timerCheckbox" type="checkbox" checked={isTimer} className={styles.checkbox} onChange={handleCheckboxChange} />
					<input id="timer" type="range" disabled={!isTimer} min="10" max="120" value={timerValue} step="10" className={styles.slider} onChange={(e) => handleSliderChange(e, 'timer')} />
					<div className={styles.sliderValue}>{secondsToHms(timerValue)}</div>
				</div>
			</Setting>
		</div>
	);
};

export default Settings;