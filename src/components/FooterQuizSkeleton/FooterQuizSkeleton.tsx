import Skeleton from '../Skeleton/Skeleton';
import styles from '../Footer/Footer.module.css';

const FooterQuizSkeleton = () => {
	return (
		<>
			<Skeleton className={styles.footerButton} width="12em" height="4em" />
			<Skeleton className={styles.footerButton} width="12em" height="4em" />
			<Skeleton className={`${styles.footerButton} ${styles.stopButton}`} width="12em" height="4em" />
		</>
	);
};

export default FooterQuizSkeleton;