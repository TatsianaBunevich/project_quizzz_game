import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Blob from './components/Blob/Blob';
import Toggle from './components/Toggle/Toggle';
import Quiz from './components/Quiz/Quiz';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Footer from './components/Footer/Footer';
import { QuizContextProvider } from './context/QuizContext';
import { Theme } from './types';

const App = () => {

	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);
	const [theme, setThemeName] = useState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
	const [questions, setQuestions] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isScoreboard, setIsScoreboard] = useState(false);

	useEffect(() => {
		const handleChange = (e: MediaQueryListEvent) => {
			handleSwitchTheme(!e.matches ? Theme.DARK : Theme.LIGHT);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mediaQuery]);

	useEffect(() => {
		const fetchQuestions = async () => {
			const data = await fetchWithRetry('https://opentdb.com/api.php?amount=3&category=9&difficulty=easy&type=multiple');
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
				<header>
					<Toggle theme={theme} onSwitchTheme={handleSwitchTheme} />
				</header>
				<QuizContextProvider questions={questions}>
					<main>
						{isPlaying ?
							isScoreboard ?
								<Scoreboard /> :
								<Quiz /> :
							<h1>Quizzz Game</h1>
						}
					</main>
					<Footer play={isPlaying} setPlay={setIsPlaying} isScoreboard={isScoreboard} setIsScoreboard={setIsScoreboard} />
				</QuizContextProvider>
			</div>
		</div>
	);
};

export default App;
