import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import NoMatchPage from './no-match'
import PathConstants from 'routes/constants'
import useResetGame from 'hooks/use-reset-game'
import { useRouteError } from 'react-router-dom'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useRouteError: vi.fn(),
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

// Mock hooks
vi.mock('hooks/use-reset-game', () => ({
  default: vi.fn(),
}))

// Mock layout
vi.mock('layouts/main-layout', () => {
  const MainLayout = ({ children, className }: any) => (
    <div data-testid="main-layout" className={className}>
      {children}
    </div>
  )
  MainLayout.Header = ({ isFixed }: { isFixed?: boolean }) => (
    <div data-testid="main-layout-header" data-fixed={isFixed}>
      Header
    </div>
  )
  MainLayout.Main = ({ children, className }: any) => (
    <main data-testid="main-layout-main" className={className}>
      {children}
    </main>
  )
  MainLayout.Footer = ({ children, className, isAbsolute }: any) => (
    <footer
      data-testid="main-layout-footer"
      className={className}
      data-abs={isAbsolute}
    >
      {children}
    </footer>
  )
  return {
    __esModule: true,
    default: MainLayout,
  }
})

// Mock Button
vi.mock('ui/button', () => ({
  __esModule: true,
  Button: ({ children, onClick, asChild }: any) =>
    asChild ? (
      <span onClick={onClick} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    ) : (
      <button onClick={onClick}>{children}</button>
    ),
}))

describe('NoMatchPage', () => {
  const mockResetGame = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useResetGame as any).mockReturnValue(mockResetGame)
  })

  it('renders core content and home link', () => {
    render(<NoMatchPage />)

    expect(screen.getByText('Oops!')).toBeInTheDocument()
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /home page/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', PathConstants.HOME)
  })

  it('displays the error message when provided by useRouteError', () => {
    const errorMessage = 'Page Not Found'
    ;(useRouteError as any).mockReturnValue(new Error(errorMessage))

    render(<NoMatchPage />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('displays the statusText when provided by useRouteError', () => {
    const statusText = 'Not Found'
    ;(useRouteError as any).mockReturnValue({ statusText })

    render(<NoMatchPage />)

    expect(screen.getByText(statusText)).toBeInTheDocument()
  })

  it('calls resetGame when home link is clicked', () => {
    render(<NoMatchPage />)

    const homeLink = screen.getByRole('link', { name: /home page/i })
    fireEvent.click(homeLink)

    expect(mockResetGame).toHaveBeenCalledTimes(1)
  })

  it('renders within MainLayout with correct header settings', () => {
    render(<NoMatchPage />)

    expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    const header = screen.getByTestId('main-layout-header')
    expect(header).toHaveAttribute('data-fixed', 'true')
  })
})