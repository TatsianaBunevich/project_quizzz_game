import { useState, useContext } from 'react';
import { GameContext } from '../../context/GameContext';
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

type PageContainerProps = {
	play: boolean;
	setPlay: (play: boolean) => void;
};

const PageContainer = ({ play, setPlay }: PageContainerProps) => {
	const { isLoading } = useContext(GameContext);
	const { isCountdown, setIsCountdown } = useContext(QuizContext);
	const [page, setPage] = useState<Page>(null);

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
		<ControlsContextProvider setPlay={setPlay} setPage={setPage}>
			<main>
				{play ?
					switchPage(page) :
					<h1>Quizzz Game</h1>
				}
			</main>
			<Footer play={play} page={page} />
		</ControlsContextProvider>
	);
};

export default PageContainer;