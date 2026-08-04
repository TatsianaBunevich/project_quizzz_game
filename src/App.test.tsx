import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock routes used by createBrowserRouter
vi.mock('@/routes', () => {
  return {
    default: [{ path: '/test', element: 'TestEl' }],
  }
})

// Mock react-router-dom's createBrowserRouter and RouterProvider
vi.mock('react-router-dom', () => {
  const createBrowserRouter = vi.fn(() => ({ mocked: true }))
  const RouterProvider = vi.fn(({ router }) => (
    // eslint-disable-next-line react/no-unknown-property
    (<div data-testid="router-provider" data-router={JSON.stringify(router)} />)
  ))
  return { createBrowserRouter, RouterProvider }
})

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    QueryClientProvider: ({ children }: any) => (
      // eslint-disable-next-line react/no-unknown-property
      (<div data-testid="query-client-provider">{children}</div>)
    ),
    QueryErrorResetBoundary: ({ children }: any) => (
      // eslint-disable-next-line react/no-unknown-property
      (<div data-testid="query-error-reset-boundary">{children}</div>)
    ),
  }
})

// Mock ReactQueryDevtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => (<div data-testid="react-query-devtools" />),
}))

// Mock ThemeProvider
vi.mock('components/providers/theme-provider', () => ({
  ThemeProvider: vi.fn(({ children }: any) => (
    // eslint-disable-next-line react/no-unknown-property
    (<div data-testid="theme-provider">{children}</div>)
  )),
}))

// Re-import mocked items for assertions
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'components/providers/theme-provider'
import routes from '@/routes'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all providers and devtools wrappers', () => {
    render(<App />)

    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument()
    expect(screen.getByTestId('query-error-reset-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('router-provider')).toBeInTheDocument()
    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument()
  })

  it('creates a router with the provided routes', () => {
    render(<App />)
    expect(createBrowserRouter).toHaveBeenCalledTimes(1)
    expect(createBrowserRouter).toHaveBeenCalledWith(routes)
  })

  it('passes expected props to ThemeProvider', () => {
    render(<App />)
    expect(ThemeProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultTheme: 'dark',
        storageKey: 'vite-ui-theme',
        children: expect.anything(),
      }),
      expect.anything()
    )
  })

  it('renders RouterProvider with a router instance', () => {
    render(<App />)
    expect(RouterProvider).toHaveBeenCalledWith(
      expect.objectContaining({ router: expect.any(Object) }),
      expect.anything()
    )
  })
})
