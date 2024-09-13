import useBoundStore from 'store/boundStore'
import { Navigate, Outlet } from 'react-router-dom'
import PathConstants from 'routes/pathConstants'
import DashboardSidebar from 'custom/dashboard-sidebar'
import DashboardSheet from 'custom/dashboard-sheet'
import { ModeToggle } from 'ui/mode-toggle'
import { TooltipProvider } from '@/components/ui/tooltip'

const DashboardLayout = () => {
  const isPlay = useBoundStore((state) => state.isPlay)
  const scores = useBoundStore((state) => state.scores)

  if (!isPlay) {
    return <Navigate to={PathConstants.HOME} replace={true} />
  } else if (!scores.length) {
    return <Navigate to={PathConstants.SETTINGS} replace={true} />
  } else {
    return (
      <TooltipProvider>
        <div className="flex min-h-screen flex-col justify-between bg-muted/40">
          <DashboardSidebar />
          <div className="flex w-full flex-col gap-4 sm:pl-16">
            <header className="sticky top-0 z-30 flex justify-between p-4 backdrop-blur-xl sm:justify-end">
              <DashboardSheet />
              <ModeToggle />
            </header>
            <main className="flex h-full flex-col px-4 pb-4">
              <Outlet />
            </main>
          </div>
        </div>
      </TooltipProvider>
    )
  }
}

export default DashboardLayout
