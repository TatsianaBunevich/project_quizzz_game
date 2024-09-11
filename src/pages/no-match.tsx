import useResetGame from 'hooks/use-reset-game'
import { useRouteError, Link } from 'react-router-dom'
import MainLayout from 'layouts/main-layout'
import { Button } from 'ui/button'
import PathConstants from 'routes/pathConstants'

const NoMatchPage = () => {
  const error = useRouteError()
  const resetGame = useResetGame()

  return (
    <MainLayout>
      <MainLayout.Header isFixed />
      <MainLayout.Main className="items-center justify-center text-center">
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
        <Button asChild onClick={() => resetGame()}>
          <Link to={PathConstants.HOME}>Home page</Link>
        </Button>
      </MainLayout.Main>
    </MainLayout>
  )
}

export default NoMatchPage
