import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Blob from './components/Blob/Blob';
import Toggle from './components/Toggle/Toggle';
import { GameContextProvider } from './context/GameContext';
import { QuizContextProvider } from './context/QuizContext';
import PageContainer from './components/PageContainer/PageContainer';
import { Theme } from './types';

const App = () => {
	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);
	const [theme, setTheme] = useState(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
	const [isPlaying, setIsPlaying] = useState(false);

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
	// TODO: animate blobs
	return (
		<div className={styles.app} data-theme={theme}>
			<Blob theme={theme} play={isPlaying} position='top' width={isPlaying ? 162 : 194} height={isPlaying ? 187 : 197} />
			<Blob theme={theme} play={isPlaying} position='bottom' width={isPlaying ? 65 : 148} height={isPlaying ? 62 : 118} />
			<div className={`${styles.container} ${isPlaying ? '' : styles.start}`}>
				<header>
					<Toggle theme={theme} onSwitchTheme={handleSwitchTheme} />
				</header>
				<GameContextProvider play={isPlaying}>
					<QuizContextProvider>
						<PageContainer  play={isPlaying} setPlay={setIsPlaying} />
					</QuizContextProvider>
				</GameContextProvider>
			</div>
		</div>
	);
};

export default App;
