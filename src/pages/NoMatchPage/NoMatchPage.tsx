import { useRouteError, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import ControlButton from '../../components/ControlButton/ControlButton';
import styles from './NoMatchPage.module.css';

const NoMatchPage = () => {
	const error = useRouteError();
	const navigate = useNavigate();

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
				<ControlButton onClick={() => navigate(-1)}>Back</ControlButton>
			</Footer>
		</>
	);
};

export default NoMatchPage;
