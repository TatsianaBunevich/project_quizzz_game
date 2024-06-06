import React from 'react';
import styles from './App.module.css';
import Quiz from './components/Quiz';
import Footer from './components/Footer';

const App: React.FC = () => {
	return (
		<div className={styles.app}>
			<Quiz />
			<Footer />
		</div>
	);
};

export default App;
