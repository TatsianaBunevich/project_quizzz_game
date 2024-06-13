import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Blob from './components/Blob/Blob';
import Toggle from './components/Toggle/Toggle';
import Quiz from './components/Quiz/Quiz';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Result from './components/Result/Result';
import Footer from './components/Footer/Footer';
import { GameContextProvider } from './context/GameContext';
import { QuizContextProvider } from './context/QuizContext';
import { Theme, Page } from './types';

const App = () => {
	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);
	const [theme, setTheme] = useState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
	const [isPlaying, setIsPlaying] = useState(false);
	const [page, setPage] = useState<Page>(null);

	useEffect(() => {
		const handleChange = (e: MediaQueryListEvent) => {
			handleSwitchTheme(!e.matches ? Theme.DARK : Theme.LIGHT);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mediaQuery]);

	const handleSwitchTheme = (theme: Theme) => {
		const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
		setTheme(newTheme);
	}

	const switchPage = (page: Page) => {
		if (!page) {
			return null;
		}
		switch(page) {
			case 'quiz':
				return <Quiz />;
			case 'result':
				return <Result />;
			case 'scoreboard':
				return <Scoreboard />;
			default:
				return null;
		}
	}

	return (
		<div className={styles.app} data-theme={theme}>
			<Blob theme={theme} play={isPlaying} position='top' width={isPlaying ? 162 : 194} height={isPlaying ? 187 : 197} />
			<Blob theme={theme} play={isPlaying} position='bottom' width={isPlaying ? 65 : 148} height={isPlaying ? 62 : 118} />
			<div className={`${styles.container} ${isPlaying ? '' : styles.start}`}>
				<header>
					<Toggle theme={theme} onSwitchTheme={handleSwitchTheme} />
				</header>
				<GameContextProvider>
					<QuizContextProvider>
						<main>
							{isPlaying ?
								switchPage(page) :
								<h1>Quizzz Game</h1>
							}
						</main>
						<Footer play={isPlaying} setPlay={setIsPlaying} page={page} setPage={setPage} />
					</QuizContextProvider>
				</GameContextProvider>
			</div>
		</div>
	);
};

export default App;
