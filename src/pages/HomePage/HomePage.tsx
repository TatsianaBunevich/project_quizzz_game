import Toggle from '../../components/Toggle/Toggle';
import Footer from '../../components/Footer/Footer';
import PathConstants from '../../routes/pathConstants';
import ControlButton from '../../components/ControlButton/ControlButton';
import styles from './HomePage.module.css';

const HomePage = () => {
	return (
		<>
			<div className={styles.blobsContainer}>
				<div className={`${styles.startBlob} ${styles.one}`}></div>
				<div className={`${styles.startBlob} ${styles.two}`}></div>
				<div className={`${styles.startBlob} ${styles.three}`}></div>
			</div>
			<div className={`${styles.container} ${styles.home}`}>
				<header>
					<Toggle />
				</header>
				<main>
					<h1>Quizzz Game</h1>
				</main>
				<Footer>
					<ControlButton className={styles.startButton} to={PathConstants.SETTINGS}>START</ControlButton>
				</Footer>
			</div>
			<div className={styles.contacts}>
				<p>Feeling fun? Got an idea?</p>
				<p>
					<a className={styles.contactLink} href="https://www.linkedin.com/in/tatsiana-bunevich/" target="_blank" rel="noreferrer">contact the creator</a>
				</p>
			</div>
		</>
	);
};

export default HomePage;
