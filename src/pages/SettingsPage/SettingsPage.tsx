import { useQueryClient } from '@tanstack/react-query';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import useBoundStore from '../../store/boundStore';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '../../components/Fallback/Fallback';
import { lazy, Suspense } from 'react';
import SettingsSkeleton from '../../components/SettingsSkeleton/SettingsSkeleton';
const Settings = lazy(() => import('../../components/Settings/Settings'));
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';

const SettingsPage = () => {
	const queryClient = useQueryClient();
	const { reset } = useQueryErrorResetBoundary();
	const addNewScore = useBoundStore((state) => state.addNewScore);
	const resetBoundStore = useBoundStore((state) => state.resetBoundStore);

	queryClient.removeQueries({ queryKey: ['questions'] });

	const handleEndQuiz = () => {
		resetBoundStore();
		queryClient.clear();
	};

	return (
		<ErrorBoundary
			fallbackRender={Fallback}
			onReset={reset}
		>
			<Suspense fallback={<SettingsSkeleton />}>
				<main>
					<Settings />
				</main>
				<Footer>
					<ControlButton to={PathConstants.QUIZ} onClick={addNewScore}>Let&apos;s go</ControlButton>
					<ControlButton to={PathConstants.HOME} onClick={handleEndQuiz}>Exit</ControlButton>
				</Footer>
			</Suspense>
		</ErrorBoundary>
	);
};

export default SettingsPage;
