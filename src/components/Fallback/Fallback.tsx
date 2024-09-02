import Footer from '../../components/Footer/Footer'
import ControlButton from '../ControlButton/ControlButton'
import styles from './Fallback.module.css'

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <>
      <main>
        <div role="alert" className={styles.fallback}>
          <p>There was an error!</p>
          <pre className={styles.errorMessage}>{error.message}</pre>
        </div>
      </main>
      <Footer>
        <ControlButton onClick={() => resetErrorBoundary()}>
          Try again
        </ControlButton>
      </Footer>
    </>
  )
}

export default Fallback
