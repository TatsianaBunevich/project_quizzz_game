import { useState, useEffect, createContext, useCallback } from 'react';
import { SettingsType, SettingType, IdType, Question } from '../types';
import { defaultSettings } from '../constants';
import useSWR from 'swr';

type GameContextType = {
	settings: SettingsType;
	handleSelectOption: (optionId: IdType | number, setting: keyof SettingsType) => void;
	setSettings: (settings: SettingsType) => void;
	createQuestionsUrl: () => void;
	questions: Question[];
}

export const GameContext = createContext<GameContextType>({
	settings: structuredClone(defaultSettings),
	handleSelectOption: () => {},
	setSettings: () => {},
	createQuestionsUrl: () => {},
	questions: []
});

export const GameContextProvider = ({ play, children }: { play: boolean, children: React.ReactNode }) => {
	const [settings, setSettings] = useState<SettingsType>(structuredClone(defaultSettings));
	const [questions, setQuestions] = useState([]);
	const [isSendingCategories, setIsSendingCategories] = useState(false);
	const [isSendingQuestions, setIsSendingQuestions] = useState(false);
	const [questionsUrl, setQuestionsUrl] = useState('');

	const fetcher = useCallback(async (url: string) => {
		const res = await fetch(url);
		const data = await res.json();

		if (!data) {
			throw new Error(`Unexpected data: ${data}.`);
		}

		if (url.includes('api_category')) {
			setIsSendingCategories(false);
		} else {
			setIsSendingQuestions(false);
		}

		return data;
	}, []);

	const { data: dbCategories, error: categoriesError, isLoading: categoriesLoading } = useSWR(isSendingCategories ? 'https://opentdb.com/api_category.php' : null, fetcher);
	const { data: dbQuestions, error: questionsError, isLoading: questionsLoading } = useSWR(questionsUrl, fetcher);
	console.log('GameContextProvider', questionsLoading);
	// TODO: add skeleton

	useEffect(() => {
		if (play) setIsSendingCategories(true);
	}, [play]);

	useEffect(() => {
		const updateSettings = async () => {
			setSettings(prev => {
				const categories = dbCategories || {trivia_categories: []};
				return {
					...prev,
					category: [
						...prev.category,
						...categories.trivia_categories.map((category: { id: number, name: string }) => ({
							id: category.id.toString(),
							name: category.name,
							isSelect: false
						}))
					]
				};
			});
		};

		updateSettings();
	}, [dbCategories]);

	const createQuestionsUrl = () => {
		const createSettingId = (setting: SettingType[]) => {
			const foundItem = setting.find((item: SettingType) => item.isSelect === true);
			return foundItem?.id === 'any' ? '' : foundItem?.id;
		}

		const params = `amount=${settings.amount}&category=${createSettingId(settings.category)}&difficulty=${createSettingId(settings.difficulty)}&type=${createSettingId(settings.type)}`;

		setQuestionsUrl(`https://opentdb.com/api.php?${params}`);
		setIsSendingQuestions(true);
	};

	useEffect(() => {
		const updateQuestions = async () => {
			setQuestions([...dbQuestions?.results || []]);
		};

		updateQuestions();
	}, [dbQuestions]);

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
				settings,
				handleSelectOption,
				setSettings,
				createQuestionsUrl,
				questions
			}
		}>
			{children}
		</GameContext.Provider>
	)
}

