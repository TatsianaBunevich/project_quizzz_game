import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Toggle from './components/Toggle/Toggle';
import Quiz from './components/Quiz/Quiz';
import Footer from './components/Footer/Footer';
import Blob from './components/Blob/Blob';
import { Theme } from './types';

const App: React.FC = () => {

	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);
	const [theme, setThemeName] = useState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
	const [questions, setQuestions] = useState([]);

	useEffect(() => {

		const handleChange = (e: MediaQueryListEvent) => {
			handleSwitchTheme(!e.matches ? Theme.DARK : Theme.LIGHT);
		};

		// handleSwitchTheme(!mediaQuery.matches ? Theme.DARK : Theme.LIGHT);

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mediaQuery]);

	useEffect(() => {
		const fetchQuestions = async () => {
			const data = await fetchWithRetry('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
			setQuestions(data.results);
		};

		fetchQuestions();
	}, []);

	const handleSwitchTheme = (theme: Theme) => {
		const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
		setThemeName(newTheme);
	}

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
		<div className={styles.app} data-theme={theme}>
			<Blob theme={theme} position={'top'} width={162} height={187} />
			<Blob theme={theme} position={'bottom'} width={65} height={62} />
			<Toggle theme={theme} onSwitchTheme={handleSwitchTheme} />
			<Quiz questions={questions} />
			<Footer />
		</div>
	);
};

export default App;
