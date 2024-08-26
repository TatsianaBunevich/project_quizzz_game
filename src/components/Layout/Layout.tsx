import { Outlet } from 'react-router-dom';
import Toggle from '../../components/Toggle/Toggle';
import styles from './Layout.module.css';

const Layout = () => {
	return (
		<>
			<div className={`${styles.playBlob} ${styles.one}`}></div>
			<div className={`${styles.playBlob} ${styles.two}`}></div>
			<div className={styles.container}>
				<header>
					<Toggle />
				</header>
				<Outlet />
			</div>
		</>
	);
};

export default Layout;
