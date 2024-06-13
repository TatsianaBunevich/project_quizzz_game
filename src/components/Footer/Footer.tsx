import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import styles from './Footer.module.css';

type FooterProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
	page: string;
	setPage: (page: string) => void;
}

const Footer = ({ play, setPlay, page, setPage }: FooterProps) => {
	const {
		setIsAnswersShown,
		isAnswersShown,
		sortedQuestions,
		activeQuestionId,
		setActiveQuestionId,
		clearQuizState,
		calculateScore,
		clearScores
	} = useContext(QuizContext);

	const checkAnswers = () => {
		calculateScore();
		setPage('result');
	}

	const showAnswers = () => {
		setIsAnswersShown(true);
		setPage('quiz');
	}

	const setNewTry = () => {
		setPlay(false);
		clearQuizState();
		setPage('quiz');
	}

	const showQuizButtons = () => {
		if (isAnswersShown) {
			return (
				<button className={`${styles.submitButton} ${styles.backButton}`} onClick={() => setPage('result')}>Back</button>
			)
		}
		const backBtn = <button className={`${styles.submitButton}`} onClick={setNewTry}>Back</button>;
		const prevBtn = <button className={`${styles.submitButton}`} onClick={() => setActiveQuestionId(activeQuestionId - 1)}>
			<span className={`${styles.arrow} ${styles.back}`}></span>
		</button>;
		const nextBtn = <button className={`${styles.submitButton}`} onClick={() => setActiveQuestionId(activeQuestionId + 1)}>
			<span className={`${styles.arrow} ${styles.next}`}></span>
		</button>;
		const checkBtn = <button className={`${styles.submitButton}`} onClick={checkAnswers}>Check</button>;

		if (sortedQuestions.length === 1) {
			return (
				<>
					{backBtn}
					{checkBtn}
				</>
			)
		} else if (activeQuestionId === 0) {
			return (
				<>
					{backBtn}
					{nextBtn}
				</>
			)
		} else if (activeQuestionId === sortedQuestions.length - 1) {
			return (
				<>
					{prevBtn}
					{checkBtn}
				</>
			)
		} else {
			return (
				<>
					{prevBtn}
					{nextBtn}
				</>
			)
		}
	}

	const submitElement = () => {
		if (!play) {
			return (
				<button className={`${styles.submitButton} ${styles.startButton}`} onClick={() => setPlay(true)}>START</button>
			)
		}
		switch(page) {
			case 'quiz':
				return showQuizButtons();
			case 'result':
				return (
					<>
						<button className={`${styles.submitButton}`} onClick={showAnswers}>Answers</button>
						<button className={`${styles.submitButton}`} onClick={() => setPage('scoreboard')}>Scores</button>
						<button className={`${styles.submitButton}`} onClick={setNewTry}>Try again</button>
						<button className={`${styles.submitButton}`} onClick={setNewTry}>Settings</button>
					</>
				)
			case 'scoreboard':
				return (
					<>
						<button className={`${styles.submitButton}`} onClick={clearScores}>Clear</button>
						<button className={`${styles.submitButton}`} onClick={() => setPage('result')}>Back</button>
					</>
				)
		}
	}

	return (
		<footer className={`${styles.footer}`}>
			{submitElement()}
		</footer>
	);
};

export default Footer;