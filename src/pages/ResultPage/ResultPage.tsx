import useBoundStore from '../../store/boundStore';
import Result from '../../components/Result/Result';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';

const ResultPage = () => {
	const handleNewTry = useBoundStore((state) => state.handleNewTry);
	const handleOpenSettings = useBoundStore((state) => state.handleOpenSettings);

	return (
		<>
			<main>
				<Result />
			</main>
			<Footer>
				<ControlButton to={PathConstants.ANSWERS}>Answers</ControlButton>
				<ControlButton to={PathConstants.SCOREBOARD}>Scores</ControlButton>
				<ControlButton to={PathConstants.QUIZ} onClick={handleNewTry}>Try again</ControlButton>
				<ControlButton to={PathConstants.SETTINGS} onClick={handleOpenSettings}>Settings</ControlButton>
			</Footer>
		</>
	);
};

export default ResultPage;
