import Skeleton from '../Skeleton/Skeleton';
import stylesSettings from '../Settings/Settings.module.css';
import stylesSetting from '../Setting/Setting.module.css';
import styles from './SettingsSkeleton.module.css';

const SettingsSkeleton = () => {
	return (
		<div className={stylesSettings.settings}>
			<div className={stylesSetting.setting}>
				<h2 className={stylesSetting.title}>
					<Skeleton width="10em" height="1.5em" />
				</h2>
				<div className={stylesSetting.options}>
					{[...Array(10)].map((_, index) => {
						const width = Math.random() * (50 - 10) + 10;
						return (
							<div key={index} style={{width: `${width}%`}} className={`${stylesSettings.option} ${styles.option}`}>
								<Skeleton width="100%" height="1em" />
							</div>
						)
					})}
				</div>
			</div>
		</div>
	);
};

export default SettingsSkeleton;