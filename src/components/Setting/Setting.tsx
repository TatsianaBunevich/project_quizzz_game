/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';
import styles from './Setting.module.css';

interface SettingProps extends React.ComponentProps<'div'> {
    title: string;
    children: React.ReactNode;
}

const Setting = ({ title, children, className }: SettingProps) => {
	return (
		<div className={`${styles.setting} ${className}`}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.options}>
				{children}
			</div>
		</div>
	)
}

export default memo(Setting);
