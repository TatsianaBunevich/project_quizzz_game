import { useState, useEffect, createContext } from 'react';
import { Question } from '../types';

type GameContextType = {
	questions: Question[];
}

export const GameContext = createContext<GameContextType>({
	questions: []
});

export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {

	const [questions, setQuestions] = useState([]);

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

	return (
		<GameContext.Provider value={
			{
				questions
			}
		}>
			{children}
		</GameContext.Provider>
	)
}

