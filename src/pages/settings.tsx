import { useQueryClient } from '@tanstack/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from 'store/bound-store'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from 'shared/fallback'
import { lazy, Suspense } from 'react'
import MainLayout from 'layouts/main-layout'
const SettingsTabs = lazy(() => import('custom/settings-tabs'))
import SettingsBadges from 'custom/settings-badges'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/constants'
import { motion } from 'framer-motion'

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { reset } = useQueryErrorResetBoundary()
  const settings = useBoundStore((state) => state.settings)
  const updateSettings = useBoundStore((state) => state.updateSettings)
  const handleSelectOption = useBoundStore((state) => state.handleSelectOption)
  const addNewScore = useBoundStore((state) => state.addNewScore)
  const resetGame = useResetGame()

  queryClient.removeQueries({ queryKey: ['questions'] })

  const SettingsFallback = () => {
    return (
      <div className="flex h-[calc(100vh-72px)]">
        <div className="m-auto">
          <motion.div
            className="font-qalisso text-3xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            QG
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <MainLayout.Header />
      <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
        <Suspense fallback={<SettingsFallback />}>
          <MainLayout.Main className="flex flex-1 justify-between">
            <SettingsTabs
              settings={settings}
              updateSettings={updateSettings}
              handleSelectOption={handleSelectOption}
            />
            <SettingsBadges settings={settings} />
          </MainLayout.Main>
          <MainLayout.Footer className="[&>*]:w-full md:[&>*]:w-1/5">
            <Button asChild variant="colorful" onClick={addNewScore}>
              <Link to={PathConstants.QUIZ}>Let&apos;s go</Link>
            </Button>
            <Button asChild variant="colorful" onClick={() => resetGame()}>
              <Link to={PathConstants.HOME}>Exit</Link>
            </Button>
          </MainLayout.Footer>
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  )
}

export default SettingsPage
