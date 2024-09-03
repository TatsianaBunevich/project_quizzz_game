import useResetQuiz from 'hooks/useResetQuiz'
import { useRouteError } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import Header from 'layout/header'
import PathConstants from 'routes/pathConstants'

const NoMatchPage = () => {
  const error = useRouteError()

  return (
    <>
      <Header className="fixed top-0 w-full" />
      <main className="container flex h-lvh flex-col items-center justify-center text-center">
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
          <i>
            {(error as Error)?.message ||
              (error as { statusText?: string })?.statusText}
          </i>
        </p>
        <Button asChild onClick={useResetQuiz}>
          <Link to={PathConstants.HOME}>Home page</Link>
        </Button>
      </main>
    </>
  )
}

export default NoMatchPage
