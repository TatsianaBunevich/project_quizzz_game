
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './Fallback.module.css';

interface FallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<div role="alert" className={styles.fallback}>
			<p>There was an error!</p>
			<SubmitButton onClick={() => resetErrorBoundary()}>Try again</SubmitButton>
			<pre className={styles.errorMessage}>{error.message}</pre>
		</div>
	);
}

export default Fallback;
