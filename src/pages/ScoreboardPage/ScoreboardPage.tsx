import useBoundStore from '../../store/boundStore';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';

const ScoreboardPage = () => {
	const resetScores = useBoundStore((state) => state.resetScores);

	return (
		<>
			<main>
				<Scoreboard />
			</main>
			<Footer>
				<ControlButton onClick={resetScores}>Clear</ControlButton>
				<ControlButton to={PathConstants.RESULT}>Back</ControlButton>
			</Footer>
		</>
	);
};

export default ScoreboardPage;
