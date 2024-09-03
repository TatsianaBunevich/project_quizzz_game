import useResetQuiz from 'hooks/useResetQuiz'
import { useRouteError } from 'react-router-dom'
import Header from 'layout/header'
import ControlButton from '../../components/ControlButton/ControlButton'
import PathConstants from '../../routes/pathConstants'
import styles from './NoMatchPage.module.css'

const NoMatchPage = () => {
  const error = useRouteError()

  return (
    <>
      <div className={styles.container}>
        <Header />
        <main>
          <div className={styles.noMatch}>
            <h1>Oops!</h1>
            <p>
              The page you are looking for <b>does not exist</b>, or you are{' '}
              <b>not allowed</b> to access this page right now.
            </p>
            <p>
              Please ensure that you are on the correct page or go back to the{' '}
              <b>Home page</b>.
            </p>
            <p>
              <i className={styles.errorMessage}>
                {(error as Error)?.message ||
                  (error as { statusText?: string })?.statusText}
              </i>
            </p>
          </div>
        </main>
        <footer>
          <ControlButton
            to={PathConstants.HOME}
            className={styles.controlButton}
            onClick={useResetQuiz}
          >
            Home page
          </ControlButton>
        </footer>
      </div>
    </>
  )
}

export default NoMatchPage
