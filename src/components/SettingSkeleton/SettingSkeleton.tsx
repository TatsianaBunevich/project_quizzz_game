import Skeleton from '../Skeleton/Skeleton';
import styles from './SettingSkeleton.module.css';
// TODO: display as buttons
const SettingSkeleton = () => {
	return (
		<div className={styles.setting}>
			<h2 className={styles.title}>
				<Skeleton width="10em" height="1.5em" />
			</h2>
			<div className={styles.options}>
				{[...Array(10)].map((_, index) => {
					const width = Math.random() * (50 - 10) + 10;
					return <Skeleton key={index} className={styles.option} width={`${width}%`} height="2em" />
				})}
			</div>
		</div>
	);
};

export default SettingSkeleton;