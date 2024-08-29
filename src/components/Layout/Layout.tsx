import useBoundStore from '../../store/boundStore';
import { Navigate } from 'react-router-dom';
import PathConstants from '../../routes/pathConstants';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Blobs from '../../components/Blobs/Blobs';
import Toggle from '../../components/Toggle/Toggle';
import styles from './Layout.module.css';

const Layout = () => {
	const isPlay = useBoundStore((state) => state.isPlay);

	useEffect(() => {
		window.onbeforeunload = () => {
			return true;
		};

		return () => {
			window.onbeforeunload = null;
		};
	}, []);

	if (!isPlay) {
		return <Navigate to={PathConstants.NOMATCH} replace={true} />;
	} else {
		return (
			<>
				<Blobs />
				<div className={styles.container}>
					<header>
						<Toggle />
					</header>
					<Outlet />
				</div>
			</>
		);
	}
};

export default Layout;
