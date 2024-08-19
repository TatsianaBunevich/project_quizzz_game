import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import SettingsSkeleton from '../SettingsSkeleton/SettingsSkeleton';
import Countdown from '../Countdown/Countdown';
import QuizSkeleton from '../QuizSkeleton/QuizSkeleton';
import Quiz from '../Quiz/Quiz';
import Scoreboard from '../Scoreboard/Scoreboard';
import Result from '../Result/Result';
import Answers from '../Answers/Answers';
import Settings from '../Settings/Settings';
import Footer from '../Footer/Footer';
import { Page } from '../../types';

const PageContainer = () => {
	const {
		play,
		page,
		isLoading,
		isCountdown
	} = useBoundStore(
		useShallow((state) => ({
			play: state.play,
			page: state.page,
			isLoading: state.isLoading,
			isCountdown: state.isCountdown
		}))
	);

	const switchPage = (page: Page) => {
		if (!page) {
			return null;
		}
		switch(page) {
			case 'settings':
				return isLoading ? <SettingsSkeleton /> : <Settings />;
			case 'quiz':
				return isCountdown ? <Countdown /> : isLoading ? <QuizSkeleton /> : <Quiz />;
			case 'result':
				return <Result />;
			case 'answers':
				return <Answers />;
			case 'scoreboard':
				return <Scoreboard />;
			default:
				return null;
		}
	}

	return (
		<>
			<main>
				{play ?
					switchPage(page) :
					<h1>Quizzz Game</h1>
				}
			</main>
			<Footer />
		</>
	);
};

export default PageContainer;
