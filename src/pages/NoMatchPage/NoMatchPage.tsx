import { useQueryClient } from '@tanstack/react-query';
import useBoundStore from '../../store/boundStore';
import { useRouteError } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import ControlButton from '../../components/ControlButton/ControlButton';
import PathConstants from '../../routes/pathConstants';
import styles from './NoMatchPage.module.css';

const NoMatchPage = () => {
	const queryClient = useQueryClient();
	const resetBoundStore = useBoundStore((state) => state.resetBoundStore);
	const error = useRouteError();

	const handleEndQuiz = () => {
		resetBoundStore();
		queryClient.clear();
	};

	return (
		<>
			<main>
				<div className={styles.noMatch}>
					<h1>Oops!</h1>
					<p>Sorry, an unexpected error has occurred.</p>
					<p>
						<i className={styles.errorMessage}>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
					</p>
				</div>
			</main>
			<Footer>
				<ControlButton to={PathConstants.HOME} onClick={handleEndQuiz}>Home page</ControlButton>
			</Footer>
		</>
	);
};

export default NoMatchPage;
