import useBoundStore from '../../store/boundStore';
import Result from '../../components/Result/Result';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';

const ResultPage = () => {
	const goal = useBoundStore((state) => state.quizItems.length);
	const score = useBoundStore((state) => state.scores[state.scores.length - 1]);
	const handleNewTry = useBoundStore((state) => state.handleNewTry);
	const resetQuiz = useBoundStore((state) => state.resetQuiz);

	return (
		<>
			<main>
				<Result
					goal={goal}
					score={score}
				/>
			</main>
			<Footer>
				<ControlButton to={PathConstants.ANSWERS}>Answers</ControlButton>
				<ControlButton to={PathConstants.SCOREBOARD}>Scores</ControlButton>
				<ControlButton to={PathConstants.QUIZ} onClick={handleNewTry}>Try again</ControlButton>
				<ControlButton to={PathConstants.SETTINGS} onClick={resetQuiz}>Settings</ControlButton>
			</Footer>
		</>
	);
};

export default ResultPage;
