import { useQueryClient } from '@tanstack/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from '../../store/boundStore'
import { ErrorBoundary } from 'react-error-boundary'
import useResetQuiz from 'hooks/useResetQuiz'
import Fallback from '../../components/Fallback/Fallback'
import { lazy, Suspense } from 'react'
import SettingsSkeleton from '../../components/SettingsSkeleton/SettingsSkeleton'
const Settings = lazy(() => import('../../components/Settings/Settings'))
import PathConstants from '../../routes/pathConstants'
import ControlButton from '../../components/ControlButton/ControlButton'

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { reset } = useQueryErrorResetBoundary()
  const settings = useBoundStore((state) => state.settings)
  const updateSettings = useBoundStore((state) => state.updateSettings)
  const handleSelectOption = useBoundStore((state) => state.handleSelectOption)
  const addNewScore = useBoundStore((state) => state.addNewScore)

  queryClient.removeQueries({ queryKey: ['questions'] })

  return (
    <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
      <Suspense fallback={<SettingsSkeleton />}>
        <main>
          <Settings
            settings={settings}
            updateSettings={updateSettings}
            handleSelectOption={handleSelectOption}
          />
        </main>
        <footer>
          <ControlButton to={PathConstants.QUIZ} onClick={addNewScore}>
            Let&apos;s go
          </ControlButton>
          <ControlButton to={PathConstants.HOME} onClick={useResetQuiz}>
            Exit
          </ControlButton>
        </footer>
      </Suspense>
    </ErrorBoundary>
  )
}

export default SettingsPage
