import { useQueryClient } from '@tanstack/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import useBoundStore from 'store/boundStore'
import { ErrorBoundary } from 'react-error-boundary'
import Fallback from 'shared/fallback'
import { lazy, Suspense } from 'react'
import SettingsSkeleton from 'components/SettingsSkeleton/SettingsSkeleton'
import MainLayout from 'layouts/main-layout'
const Settings = lazy(() => import('custom/settings'))
import { cn } from '@/lib/utils'
import { Badge } from 'ui/badge'
import { Link } from 'react-router-dom'
import { Button } from 'ui/button'
import useResetQuiz from 'hooks/useResetQuiz'
import { secondsToHms } from '@/helpers'
import PathConstants from 'routes/pathConstants'
import { SettingType } from '@/types'

const SettingsPage = () => {
  const queryClient = useQueryClient()
  const { reset } = useQueryErrorResetBoundary()
  const settings = useBoundStore((state) => state.settings)
  const updateSettings = useBoundStore((state) => state.updateSettings)
  const handleSelectOption = useBoundStore((state) => state.handleSelectOption)
  const addNewScore = useBoundStore((state) => state.addNewScore)

  queryClient.removeQueries({ queryKey: ['questions'] })

  const findName = (option: SettingType[]) =>
    option.find((i) => i.isSelected)?.name

  const category = findName(settings.category)
  const difficulty = findName(settings.difficulty)
  const type = findName(settings.type)
  const amount = settings.amount
  const timer = settings.timer

  return (
    <MainLayout>
      <MainLayout.Header />
      <ErrorBoundary fallbackRender={Fallback} onReset={reset}>
        <Suspense fallback={<SettingsSkeleton />}>
          <MainLayout.Main className="justify-between">
            <Settings
              settings={settings}
              updateSettings={updateSettings}
              handleSelectOption={handleSelectOption}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {category} {category === 'Any' && 'category'}
              </Badge>
              <Badge variant="secondary">
                {difficulty} {difficulty === 'Any' && 'difficulty'}
              </Badge>
              <Badge variant="secondary">
                {type} {type === 'Any' && 'type'}
              </Badge>
              <Badge variant="secondary">
                {amount} question{amount !== 1 && 's'}
              </Badge>
              <Badge
                variant="secondary"
                className={cn({ 'opacity-30': !timer })}
              >
                {timer ? secondsToHms(timer) : 'off'}
              </Badge>
            </div>
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
