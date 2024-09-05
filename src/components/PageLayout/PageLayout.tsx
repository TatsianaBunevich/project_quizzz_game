import useBoundStore from 'store/boundStore'
import { Navigate } from 'react-router-dom'
import PathConstants from 'routes/pathConstants'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const PageLayout = () => {
  const isPlay = useBoundStore((state) => state.isPlay)

  useEffect(() => {
    window.onbeforeunload = () => {
      return true
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [])

  if (!isPlay) {
    return <Navigate to={PathConstants.NOMATCH} replace={true} />
  } else {
    return (
      <>
        {/* <Header /> */}
        <Outlet />
      </>
    )
  }
}

export default PageLayout
