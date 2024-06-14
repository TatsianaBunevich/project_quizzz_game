import { useState, useEffect, createContext } from 'react';
import { SettingsType, SettingType, IdType, Question } from '../types';
import { defaultSettings } from '../constants';

type GameContextType = {
	settings: SettingsType;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
	setSettings: (settings: SettingsType) => void;
	questions: Question[];
}

export const GameContext = createContext<GameContextType>({
	settings: structuredClone(defaultSettings),
	handleSelectOption: () => {},
	setSettings: () => {},
	questions: []
});

export const GameContextProvider = ({ play, children }: { play: boolean, children: React.ReactNode }) => {
	const [settings, setSettings] = useState<SettingsType>(structuredClone(defaultSettings));
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		const fetchSettings = async () => {
			const data = await fetchWithRetry('https://opentdb.com/api_category.php');
			setSettings(prev => {
				return {
					...prev,
					category: [
						...prev.category,
						...data.trivia_categories.map((category: { id: number, name: string }) => ({
							id: category.id.toString(),
							name: category.name,
							isSelect: false
						}))
					]
				};
			});
		};

		if (play) fetchSettings();
	}, [play]);

	useEffect(() => {
		const fetchQuestions = async () => {
			const data = await fetchWithRetry('https://opentdb.com/api.php?amount=3&category=9&difficulty=easy&type=multiple');
			setQuestions(data.results);
		};

		fetchQuestions();
	}, []);

	const fetchWithRetry = async (url: string, retries = 3, backoff = 300) => {
		for (let i = 0; i < retries; i++) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return await response.json();
			} catch (error) {
				if (i < retries - 1) {
					await new Promise(res => setTimeout(res, backoff * (i + 1)));
				} else {
					throw error;
				}
			}
		}
	};

	const handleSelectOption = (optionId: IdType | number, setting: keyof SettingsType) => {
		setSettings(prev => {
			const newPrev = {...prev};

			if (setting === 'amount') {
				newPrev.amount = optionId as number;
			} else {
				const settingsArray = newPrev[setting] as SettingType[];
				const foundIndex = settingsArray.findIndex((item: SettingType) => item.id === optionId);

				settingsArray.forEach((item: SettingType) => {
					item.isSelect = false;
				});

				settingsArray[foundIndex].isSelect = true;
			}

			return newPrev;
		});
	};

	// TODO: Add timer

	return (
		<GameContext.Provider value={
			{
				settings,
				handleSelectOption,
				setSettings,
				questions
			}
		}>
			{children}
		</GameContext.Provider>
	)
}

