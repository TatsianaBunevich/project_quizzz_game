import { useState, useEffect } from 'react';
import styles from './App.module.css';
import Blobs from './components/Blobs/Blobs';
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

	return (
		<div className={styles.app} data-theme={theme}>
			<Blobs play={isPlaying} />
			<div className={`${styles.container} ${isPlaying ? '' : styles.start}`}>
				<header>
					<Toggle theme={theme} onSwitchTheme={handleSwitchTheme} />
				</header>
				<GameContextProvider play={isPlaying}>
					<QuizContextProvider>
						<PageContainer play={isPlaying} setPlay={setIsPlaying} />
					</QuizContextProvider>
				</GameContextProvider>
			</div>
			{!isPlaying && (
				<div className={styles.contacts}>
					<p>Feeling fun? Got an idea?</p>
					<p><a className={styles.contactLink} href="https://www.linkedin.com/in/tatsiana-bunevich/" target="_blank">contact the creator</a></p>
				</div>
			)}
		</div>
	);
};

export default App;
