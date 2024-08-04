import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { useContext } from 'react';
import { QuizContext } from '../../context/QuizContext';
import { ControlsContextProvider } from '../../context/ControlsContext';
import SettingsSkeleton from '../SettingsSkeleton/SettingsSkeleton';
import Countdown from '../Countdown/Countdown';
import QuizSkeleton from '../QuizSkeleton/QuizSkeleton';
import Quiz from '../Quiz/Quiz';
import Scoreboard from '../Scoreboard/Scoreboard';
import Result from '../Result/Result';
import Settings from '../Settings/Settings';
import Footer from '../Footer/Footer';
import { Page } from '../../types';

const PageContainer = () => {
	const { isCountdown, setIsCountdown } = useContext(QuizContext);

	const { play, page, isLoading } = useBoundStore(
		useShallow((state) => ({ play: state.play, page: state.page, isLoading: state.isLoading }))
	);

	const switchPage = (page: Page) => {
		if (!page) {
			return null;
		}
		switch(page) {
			case 'settings':
				return isLoading ? <SettingsSkeleton /> : <Settings />;
			case 'quiz':
				return isCountdown ? <Countdown setIsCountdown={setIsCountdown} /> : isLoading ? <QuizSkeleton /> : <Quiz />;
			case 'result':
				return <Result />;
			case 'scoreboard':
				return <Scoreboard />;
			default:
				return null;
		}
	}

	return (
		<ControlsContextProvider>
			<main>
				{play ?
					switchPage(page) :
					<h1>Quizzz Game</h1>
				}
			</main>
			<Footer />
		</ControlsContextProvider>
	);
};

export default PageContainer;