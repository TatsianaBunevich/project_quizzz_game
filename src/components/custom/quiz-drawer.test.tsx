import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import QuizDrawer from './quiz-drawer'
import PathConstants from 'routes/constants'
import useBoundStore from 'store/bound-store'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useMatch: vi.fn(),
  }
})

// Mock store
vi.mock('store/bound-store', () => {
  const mockUseBoundStore = vi.fn()
  const mockSetState = vi.fn()

  // Attach setState to the function object
  Object.assign(mockUseBoundStore, { setState: mockSetState })

  return {
    __esModule: true,
    default: mockUseBoundStore,
  }
})

// Mock UI components
vi.mock('@/components/ui/drawer', () => ({
  __esModule: true,
  Drawer: ({ children, onClose }: any) => (
    <div data-testid="drawer">
      <button onClick={onClose}>Mock Close Drawer</button>
      {children}
    </div>
  ),
  DrawerTrigger: ({ children }: any) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
  DrawerContent: ({ children }: any) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerClose: ({ children }: any) => (
    <div data-testid="drawer-close">{children}</div>
  ),
  DrawerHeader: ({ children }: any) => (
    <div data-testid="drawer-header">{children}</div>
  ),
  DrawerTitle: () => <div data-testid="drawer-title" />,
  DrawerDescription: () => <div data-testid="drawer-description" />,
}))

const mockedUseBoundStore = vi.mocked(useBoundStore)
const mockedSetState = vi.mocked((useBoundStore as any).setState)

describe('QuizDrawer', () => {
  const mockHandleNextButton = vi.fn()
  const mockResetQuiz = vi.fn()
  const mockStopTimer = vi.fn()
  const mockRestartTimer = vi.fn()

  const lastQuizItem = 5

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseBoundStore.mockImplementation((selector: any) =>
      selector({
        handleNextButton: mockHandleNextButton,
        resetQuiz: mockResetQuiz,
        stopTimer: mockStopTimer,
        restartTimer: mockRestartTimer,
        settings: {
          timer: true,
        },
      })
    )
  })

  it('renders the trigger button', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)
    expect(screen.getByTestId('drawer-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('drawer-trigger').querySelector('button')).toBeInTheDocument()
  })

  it('calls stopTimer when trigger button is clicked and timer is enabled', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const triggerBtn = screen.getByTestId('drawer-trigger').querySelector('button')
    fireEvent.click(triggerBtn!)

    expect(mockStopTimer).toHaveBeenCalledTimes(1)
  })

  it('does not call stopTimer when trigger button is clicked and timer is disabled', () => {
    mockedUseBoundStore.mockImplementation((selector: any) =>
      selector({
        handleNextButton: mockHandleNextButton,
        resetQuiz: mockResetQuiz,
        stopTimer: mockStopTimer,
        restartTimer: mockRestartTimer,
        settings: {
          timer: false,
        },
      })
    )

    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const triggerBtn = screen.getByTestId('drawer-trigger').querySelector('button')
    fireEvent.click(triggerBtn!)

    expect(mockStopTimer).not.toHaveBeenCalled()
  })

  it('calls restartTimer when "Back to the game" is clicked and timer is enabled', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const backBtn = screen.getByText('Back to the game')
    fireEvent.click(backBtn)

    expect(mockRestartTimer).toHaveBeenCalledTimes(1)
  })

  it('does not call restartTimer when "Back to the game" is clicked and timer is disabled', () => {
    mockedUseBoundStore.mockImplementation((selector: any) =>
      selector({
        handleNextButton: mockHandleNextButton,
        resetQuiz: mockResetQuiz,
        stopTimer: mockStopTimer,
        restartTimer: mockRestartTimer,
        settings: {
          timer: false,
        },
      })
    )

    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const backBtn = screen.getByText('Back to the game')
    fireEvent.click(backBtn)

    expect(mockRestartTimer).not.toHaveBeenCalled()
  })

  it('calls setState and handleNextButton when "See the result" is clicked', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const resultLink = screen.getByRole('link', { name: /see the result/i })
    fireEvent.click(resultLink)

    expect(mockedSetState).toHaveBeenCalledWith(
      { activeId: lastQuizItem },
      undefined,
      'quiz/getLastQuizItemId'
    )
    expect(mockHandleNextButton).toHaveBeenCalledTimes(1)
    expect(resultLink).toHaveAttribute('href', PathConstants.RESULT)
  })

  it('calls resetQuiz when "Go to settings" is clicked', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const settingsLink = screen.getByRole('link', { name: /go to settings/i })
    fireEvent.click(settingsLink)

    expect(mockResetQuiz).toHaveBeenCalledTimes(1)
    expect(settingsLink).toHaveAttribute('href', PathConstants.SETTINGS)
  })

  it('calls restartTimer when the Drawer onClose is triggered', () => {
    render(<QuizDrawer lastQuizItem={lastQuizItem} />)

    const closeDrawerBtn = screen.getByText('Mock Close Drawer')
    fireEvent.click(closeDrawerBtn)

    expect(mockRestartTimer).toHaveBeenCalledTimes(1)
  })
})
