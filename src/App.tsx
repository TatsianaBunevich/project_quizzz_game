import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Blob from './components/Blob/Blob';
import Header from './components/Header/Header';
import Quiz from './components/Quiz/Quiz';
import Footer from './components/Footer/Footer';
import { Theme } from './types';

const App = () => {

	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);
	const [theme, setThemeName] = useState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
	const [questions, setQuestions] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

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
			<Blob theme={theme} play={isPlaying} position='top' width={isPlaying ? 162 : 194} height={isPlaying ? 187 : 197} />
			<Blob theme={theme} play={isPlaying} position='bottom' width={isPlaying ? 65 : 148} height={isPlaying ? 62 : 118} />
			<div className={styles.container}>
				<Header theme={theme} onSwitchTheme={handleSwitchTheme} />
				{isPlaying ?
					<Quiz questions={questions} /> :
					<h1>Quizzz Game</h1>
				}
				<Footer play={isPlaying} setPlay={setIsPlaying} />
			</div>
		</div>
	);
};

export default App;
