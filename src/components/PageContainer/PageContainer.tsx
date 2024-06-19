import { useState } from 'react';
import { ControlsContextProvider } from '../../context/ControlsContext';
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
	const [page, setPage] = useState<Page>(null);

	const switchPage = (page: Page) => {
		if (!page) {
			return null;
		}
		switch(page) {
			case 'settings':
				return <Settings />;
			case 'quiz':
				return <Quiz />;
			case 'result':
				return <Result />;
			case 'scoreboard':
				return <Scoreboard />;
			default:
				return null;
		}
	}
	// TODO: add provider
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