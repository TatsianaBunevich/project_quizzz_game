import useBoundStore from '../../store/boundStore';
import Answers from '../../components/Answers/Answers';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';
import styles from './AnswersPage.module.css';

const AnswersPage = () => {
	const sortedQuestions = useBoundStore((state) => state.sortedQuestions);

	return (
		<>
			<main>
				<Answers sortedQuestions={sortedQuestions} />
			</main>
			<Footer>
				<ControlButton to={PathConstants.RESULT} className={styles.footerButton}>Back</ControlButton>
			</Footer>
		</>
	);
};

export default AnswersPage;
