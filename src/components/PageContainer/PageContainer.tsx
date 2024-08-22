import { lazy, Suspense } from 'react';
import useBoundStore from '../../store/boundStore';
import { useShallow } from 'zustand/react/shallow';
import { QueryErrorResetBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '../Fallback/Fallback';
import SettingsSkeleton from '../SettingsSkeleton/SettingsSkeleton';
import Countdown from '../Countdown/Countdown';
import QuizSkeleton from '../QuizSkeleton/QuizSkeleton';
const Settings = lazy(() => import('../Settings/Settings'));
const Quiz = lazy(() => import('../Quiz/Quiz'));
import Result from '../Result/Result';
import Answers from '../Answers/Answers';
import Scoreboard from '../Scoreboard/Scoreboard';
import Footer from '../Footer/Footer';
import { Page } from '../../types';
import styles from './PageContainer.module.css';

const queryClient = new QueryClient();

const PageContainer = () => {
	const {
		play,
		page,
		isCountdown
	} = useBoundStore(
		useShallow((state) => ({
			play: state.play,
			page: state.page,
			isCountdown: state.isCountdown
		}))
	);

	if (!play) {
		queryClient.clear();
	}

	const switchPage = (page: Page) => {
		switch(page) {
			case 'settings':
				return (
					<Suspense fallback={<SettingsSkeleton />}>
						<Settings />
					</Suspense>
				);
			case 'quiz':
				return (
					<>
						{isCountdown && <Countdown />}
						<div className={`${styles.quizWrap} ${!isCountdown ? styles.active : ''}`}>
							<Suspense fallback={<QuizSkeleton />}>
								<Quiz />
							</Suspense>
						</div>
					</>
				)
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
		<QueryClientProvider client={queryClient}>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						fallbackRender={Fallback}
						onReset={reset}
					>
						<main>
							{play ?
								switchPage(page) :
								<h1>Quizzz Game</h1>
							}
						</main>
						<Footer />
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default PageContainer;
