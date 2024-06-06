import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Quiz from './components/Quiz';
import Footer from './components/Footer';

const App: React.FC = () => {

	const [questions, setQuestions] = useState([]);

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

	useEffect(() => {
		const fetchQuestions = async () => {
			const data = await fetchWithRetry('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
			setQuestions(data.results);
		};

		fetchQuestions();
	}, []);

	return (
		<div className={styles.app}>
			<Quiz questions={questions} />
			<Footer />
		</div>
	);
};

export default App;
