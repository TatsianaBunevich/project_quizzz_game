import {
  QueryErrorResetBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@components/theme-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'

const queryClient = new QueryClient()

const App = () => {
  const router = createBrowserRouter(routes)

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryErrorResetBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
