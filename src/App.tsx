import { QueryErrorResetBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useBoundStore from './store/boundStore';
import { useEffect } from 'react';
import routes from './routes';
import HomePage from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import NoMatchPage from './pages/NoMatchPage/NoMatchPage';
import { Theme } from './types';
import styles from './App.module.css';

const queryClient = new QueryClient();

const App = () => {
	const router = createBrowserRouter([
		{ index: true, Component: HomePage },
		{ path: '/', Component: Layout, children: routes },
		{ path: '*', Component: NoMatchPage }
	]);
	const theme = useBoundStore((state) => state.theme);
	const switchTheme = useBoundStore((state) => state.switchTheme);
	const mediaQuery = window.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`);

	useEffect(() => {
		const handleChange = (e: MediaQueryListEvent) => {
			switchTheme(e.matches ? Theme.DARK : Theme.LIGHT);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mediaQuery, switchTheme]);

	return (
		<div className={styles.app} data-theme={theme}>
			<QueryClientProvider client={queryClient}>
				<QueryErrorResetBoundary>
					<RouterProvider router={router} />
				</QueryErrorResetBoundary>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</div>
	);
};

export default App;
