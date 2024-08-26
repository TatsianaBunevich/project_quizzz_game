import Answers from '../../components/Answers/Answers';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';
import styles from './AnswersPage.module.css';

const AnswersPage = () => {
	return (
		<>
			<main>
				<Answers />
			</main>
			<Footer>
				<ControlButton to={PathConstants.RESULT} className={styles.footerButton}>Back</ControlButton>
			</Footer>
		</>
	);
};

export default AnswersPage;
