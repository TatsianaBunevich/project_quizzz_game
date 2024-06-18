import { useState, useEffect, createContext, useCallback } from 'react';
import { SettingsType, SettingType, IdType, Question } from '../types';
import { DEFAULTSETTINGS } from '../constants';

type GameContextType = {
	isLoading: boolean;
	settings: SettingsType;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
	setSettings: (settings: SettingsType) => void;
	setIsUpdateQuestions: (isUpdateQuestions: boolean) => void;
	questions: Question[];
}

export const GameContext = createContext<GameContextType>({
	isLoading: false,
	settings: structuredClone(DEFAULTSETTINGS),
	handleSelectOption: () => {},
	setSettings: () => {},
	setIsUpdateQuestions: () => {},
	questions: []
});

export const GameContextProvider = ({ play, children }: { play: boolean, children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [settings, setSettings] = useState<SettingsType>(structuredClone(DEFAULTSETTINGS));
	const [questions, setQuestions] = useState([]);
	const [isUpdateQuestions, setIsUpdateQuestions] = useState(false);

	useEffect(() => {
		const updateSettings = async () => {
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

		if (play) updateSettings();
	}, [play]);

	const createQuestionsUrl = useCallback(() => {
		const createSettingId = (setting: SettingType[]) => {
			const foundItem = setting.find((item: SettingType) => item.isSelect === true);
			return foundItem?.id === 'any' ? '' : foundItem?.id;
		}

		const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

		return `https://opentdb.com/api.php?${params}`;
	}, [settings]);

	useEffect(() => {
		const updateQuestions = async () => {
			const data = await fetchWithRetry(createQuestionsUrl());
			setQuestions(data.results);
			setIsUpdateQuestions(false);
		};

		if (isUpdateQuestions) updateQuestions();
	}, [isUpdateQuestions, createQuestionsUrl]);

	const fetchWithRetry = async (url: string, retries = 3, backoff = 300) => {
		setIsLoading(true);
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
			} finally {
				setIsLoading(false);
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
				const foundItem = settingsArray.find((item: SettingType) => item.id === optionId);

				settingsArray.forEach((item: SettingType) => {
					item.isSelect = false;
				});

				foundItem && (foundItem.isSelect = true);
			}

			return newPrev;
		});
	};

	// TODO: Add timer

	return (
		<GameContext.Provider value={
			{
				isLoading,
				settings,
				handleSelectOption,
				setSettings,
				setIsUpdateQuestions,
				questions
			}
		}>
			{children}
		</GameContext.Provider>
	)
}

