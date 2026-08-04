import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import DashboardSheet from './dashboard-sheet'
import PathConstants from 'routes/constants'
import useBoundStore from 'store/bound-store'
import useResetGame from 'hooks/use-reset-game'

// Mock react-router-dom
const mockUseMatch = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useMatch: (path: string) => mockUseMatch(path),
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

// Mock store
vi.mock('store/bound-store', () => ({
  __esModule: true,
  default: vi.fn(),
}))

// Mock hooks
vi.mock('hooks/use-reset-game', () => ({
  default: vi.fn(),
}))

// Mock UI components
vi.mock('ui/button', () => ({
  __esModule: true,
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet" data-open={open}>
      <button onClick={() => onOpenChange(!open)}>Toggle Sheet</button>
      {children}
    </div>
  ),
  SheetTrigger: ({ children }: any) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children, side }: any) => (
    <div data-testid="sheet-content" data-side={side}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: any) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: any) => (
    <div data-testid="sheet-title">{children}</div>
  ),
  SheetDescription: () => (
    <div data-testid="sheet-description">Description</div>
  ),
}))

const mockedUseBoundStore = vi.mocked(useBoundStore)
const mockedUseResetGame = vi.mocked(useResetGame)

describe('DashboardSheet', () => {
  const mockHandleNewTry = vi.fn()
  const mockResetQuiz = vi.fn()
  const mockResetGame = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mockUseMatch.mockReturnValue(null)

    mockedUseBoundStore.mockImplementation((selector: any) =>
      selector({
        handleNewTry: mockHandleNewTry,
        resetQuiz: mockResetQuiz,
      })
    )
    mockedUseResetGame.mockReturnValue(mockResetGame)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the trigger button', () => {
    render(<DashboardSheet />)
    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument()
    expect(screen.getByText('Toggle Menu')).toBeInTheDocument()
  })

  it('opens the sheet when trigger is clicked', () => {
    render(<DashboardSheet />)

    // The mocked Sheet implementation has a "Toggle Sheet" button for testing
    const toggleBtn = screen.getByText('Toggle Sheet')
    fireEvent.click(toggleBtn)

    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'true')
  })

  it('renders all navigation links with correct paths', () => {
    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))

    expect(screen.getByRole('link', { name: /result/i })).toHaveAttribute(
      'href',
      PathConstants.RESULT
    )
    expect(screen.getByRole('link', { name: /answers/i })).toHaveAttribute(
      'href',
      PathConstants.ANSWERS
    )
    expect(screen.getByRole('link', { name: /scores/i })).toHaveAttribute(
      'href',
      PathConstants.SCOREBOARD
    )
    expect(screen.getByRole('link', { name: /try again/i })).toHaveAttribute(
      'href',
      PathConstants.QUIZ
    )
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
      'href',
      PathConstants.SETTINGS
    )
  })

  it('applies active styles to the matching link', () => {
    mockUseMatch.mockImplementation(
      (path: string) => path === PathConstants.RESULT
    )

    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))

    const resultLink = screen.getByRole('link', { name: /result/i })
    expect(resultLink).toHaveClass('bg-accent text-accent-foreground')

    const answersLink = screen.getByRole('link', { name: /answers/i })
    expect(answersLink).toHaveClass('text-muted-foreground')
  })

  it('calls handleNewTry when "Try again" is clicked', () => {
    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))

    const tryAgainBtn = screen.getByRole('link', { name: /try again/i })
    fireEvent.click(tryAgainBtn)
    expect(mockHandleNewTry).toHaveBeenCalledTimes(1)
  })

  it('calls resetQuiz when "Settings" is clicked', () => {
    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))

    const settingsBtn = screen.getByRole('link', { name: /settings/i })
    fireEvent.click(settingsBtn)
    expect(mockResetQuiz).toHaveBeenCalledTimes(1)
  })

  it('calls resetGame when the logo is clicked', () => {
    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))

    const logoLink = screen.getByRole('link', { name: /quizzz game/i })
    fireEvent.click(logoLink)
    expect(mockResetGame).toHaveBeenCalledTimes(1)
  })

  it('closes the sheet when window is resized to a larger width', () => {
    render(<DashboardSheet />)
    fireEvent.click(screen.getByText('Toggle Sheet'))
    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'true')

    // Change window width to >= 640px
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      window.dispatchEvent(new Event('resize'))
    })

    // Due to debounce (300ms), we need to wait
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByTestId('sheet')).toHaveAttribute('data-open', 'false')
  })
})
