import Skeleton from '../Skeleton/Skeleton';
import styles from './SettingSkeleton.module.css';
// FIXME: don't change width on every render? + is it enough (or we need more settings?)
const SettingSkeleton = () => {
	return (
		<div className={styles.setting}>
			<h2 className={styles.title}>
				<Skeleton width="10em" height="1.5em" />
			</h2>
			<div className={styles.options}>
				{[...Array(10)].map((_, index) => {
					const width = Math.random() * (50 - 10) + 10;
					return (
						<div key={index} style={{width: `${width}%`}} className={styles.option}>
							<Skeleton width="100%" height="1em" />
						</div>
					)
				})}
			</div>
		</div>
	);
};

export default SettingSkeleton;