import styles from './Setting.module.css';

type SettingProps = {
    title: string;
    children: React.ReactNode;
}

const Setting = ({ title, children }: SettingProps) => {
	return (
		<div className={styles.setting}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.options}>
				{children}
			</div>
		</div>
	)
}

export default Setting;