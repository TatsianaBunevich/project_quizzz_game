import useBoundStore from '../../store/boundStore';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';

const ScoreboardPage = () => {
	const scores = useBoundStore((state) => state.scores);
	const resetScores = useBoundStore((state) => state.resetScores);
	const resetQuiz = useBoundStore((state) => state.resetQuiz);

	return (
		<>
			<main>
				<Scoreboard />
			</main>
			<Footer>
				<ControlButton onClick={resetScores}>Clear</ControlButton>
				{scores.length ?
					<ControlButton to={PathConstants.RESULT}>Back</ControlButton> :
					<ControlButton to={PathConstants.SETTINGS} onClick={resetQuiz}>Settings</ControlButton>
				}
			</Footer>
		</>
	);
};

export default ScoreboardPage;
