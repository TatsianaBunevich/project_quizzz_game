import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useMemo, useCallback } from 'react';
import Setting from '../Setting/Setting';
import Button from '../Button/Button';
import { secondsToHms } from '../../helpers';
import { debounce } from 'lodash';
import { CategoriesResponse, SettingsType } from '../../types';
import { SettingsState, SettingsActions } from '../../store/types';
import styles from './Settings.module.css';

const Settings = ({ settings, updateSettings, handleSelectOption }: SettingsState & SettingsActions) => {
	const [categoryClass, setCategoryClass] = useState('');
	const [rangeValue, setRangeValue] = useState(settings.amount);
	const [timerValue, setTimerValue] = useState(settings.timer);
	const [isTimer, setIsTimer] = useState(settings.timer === 0 ? false : true);

	useSuspenseQuery({
		queryKey: ['settings'],
		queryFn: async () => {
			const response = await axios.get<CategoriesResponse>('https://opentdb.com/api_category.php');
			return response.data;
		},
		select: settings.category.length === 1 ? updateSettings : undefined,
		staleTime: Infinity,
	});

	const handleOverflow = () => {
		setCategoryClass(styles.overflowHidden);
	};

	const debounceFn = useMemo(() => debounce(handleSelectOption, 300), [handleSelectOption]);

	const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: keyof SettingsType) => {
		const value = Number(event.target.value);
		if (type === 'amount') {
			setRangeValue(value);
		} else {
			setTimerValue(value);
		}
		debounceFn(value, type);
	}, [debounceFn]);

	const handleCheckboxChange = useCallback(() => {
		const newTimerValue = isTimer ? 0 : 10;
		setTimerValue(newTimerValue);
		debounceFn(newTimerValue, 'timer');
		setIsTimer(!isTimer);
	}, [debounceFn, isTimer]);

	const memoizedCategory = useMemo(() =>
		<>
			<div className={styles.overflow} onClick={handleOverflow}></div>
			{settings.category.map((option) => (
				<Button
					key={option.id}
					className={`${styles.option} ${option.isSelected ? styles.selected : ''}`}
					onClick={() => handleSelectOption(option.id, 'category')}>{option.name}
				</Button>
			))}
		</>, [handleSelectOption, settings.category]);

	const memoizedDifficulty = useMemo(() =>
		settings.difficulty.map((option) => (
			<Button
				key={option.id}
				className={`${styles.option} ${option.isSelected ? styles.selected : ''}`}
				onClick={() => handleSelectOption(option.id, 'difficulty')}>{option.name}
			</Button>
		)), [handleSelectOption, settings.difficulty]);

	const memoizedType = useMemo(() =>
		settings.type.map((option) => (
			<Button
				key={option.id}
				className={`${styles.option} ${option.isSelected ? styles.selected : ''}`}
				onClick={() => handleSelectOption(option.id, 'type')}>{option.name}
			</Button>
		)), [handleSelectOption, settings.type]);

	const memoizedAmount = useMemo(() =>
		<div className={styles.sliderContainer}>
			<input id="amount" type="range" min="1" max="50" value={rangeValue} className={styles.slider} onChange={(e) => handleSliderChange(e, 'amount')} />
			<div className={styles.sliderValue}>{rangeValue}</div>
		</div>, [handleSliderChange, rangeValue]);

	const memoizedTimer = useMemo(() =>
		<div className={styles.sliderContainer}>
			<input id="timerCheckbox" type="checkbox" checked={isTimer} className={styles.checkbox} onChange={handleCheckboxChange} />
			<input id="timer" type="range" disabled={!isTimer} min="10" max="120" value={timerValue} step="10" className={styles.slider} onChange={(e) => handleSliderChange(e, 'timer')} />
			<div className={styles.sliderValue}>{secondsToHms(timerValue)}</div>
		</div>, [handleCheckboxChange, handleSliderChange, isTimer, timerValue]);

	return (
		<div className={styles.settings}>
			<Setting title="Category" className={`${styles.category} ${categoryClass}`}>
				{memoizedCategory}
			</Setting>
			<Setting title="Difficulty">
				{memoizedDifficulty}
			</Setting>
			<Setting title="Type">
				{memoizedType}
			</Setting>
			<Setting title="Number of Questions">
				{memoizedAmount}
			</Setting>
			<Setting title="Timer (per question)">
				{memoizedTimer}
			</Setting>
		</div>
	);
};

export default Settings;
