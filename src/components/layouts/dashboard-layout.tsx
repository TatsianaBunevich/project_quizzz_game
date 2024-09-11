import useBoundStore from 'store/boundStore'
import { Navigate, Outlet } from 'react-router-dom'
import PathConstants from 'routes/pathConstants'
import DashboardSidebar from 'custom/dashboard-sidebar'
import DashboardSheet from 'custom/dashboard-sheet'
import { ModeToggle } from 'components/mode-toggle'
import { TooltipProvider } from '@/components/ui/tooltip'

const DashboardLayout = () => {
  const isPlay = useBoundStore((state) => state.isPlay)

  if (!isPlay) {
    return <Navigate to={PathConstants.HOME} replace={true} />
  } else {
    return (
      <TooltipProvider>
        <div className="flex min-h-screen flex-col justify-between bg-muted/40">
          <DashboardSidebar />
          <div className="flex w-full flex-col sm:gap-4 sm:pl-16">
            <header className="flex justify-between p-4 sm:justify-end">
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
