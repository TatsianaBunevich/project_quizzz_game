import { useQueryClient } from '@tanstack/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from 'shared/fallback'
import { lazy, Suspense } from 'react'
import MainLayout from 'layouts/main-layout'
const SettingsTabs = lazy(() => import('custom/settings-tabs'))
import SettingsBadges from 'custom/settings-badges'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import useResetQuiz from 'hooks/useResetQuiz'
import PathConstants from 'routes/pathConstants'

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { reset } = useQueryErrorResetBoundary()
  const settings = useBoundStore((state) => state.settings)
  const updateSettings = useBoundStore((state) => state.updateSettings)
  const handleSelectOption = useBoundStore((state) => state.handleSelectOption)
  const addNewScore = useBoundStore((state) => state.addNewScore)

  queryClient.removeQueries({ queryKey: ['questions'] })

  return (
    <MainLayout>
      <MainLayout.Header />
      <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
        {/* TODO: add fallback */}
        <Suspense fallback="">
          <MainLayout.Main className="justify-between">
            <SettingsTabs
              settings={settings}
              updateSettings={updateSettings}
              handleSelectOption={handleSelectOption}
            />
            <SettingsBadges settings={settings} />
          </MainLayout.Main>
          <MainLayout.Footer className="[&>*]:w-full md:[&>*]:w-1/5">
            <Button asChild onClick={addNewScore}>
              <Link to={PathConstants.QUIZ}>Let&apos;s go</Link>
            </Button>
            <Button asChild onClick={useResetQuiz}>
              <Link to={PathConstants.HOME}>Exit</Link>
            </Button>
          </MainLayout.Footer>
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  )
}

export default SettingsPage
