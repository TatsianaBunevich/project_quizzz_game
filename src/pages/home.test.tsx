import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import HomePage from './home'
import PathConstants from 'routes/constants'
import useBoundStore from 'store/bound-store'

// Mock store
vi.mock('store/bound-store', () => ({
  __esModule: true,
  default: vi.fn((selector: any) => selector({ toggleIsPlay: vi.fn() })),
}))

// Mock layout with sub-components
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

// Mock three fiber Canvas and lazy component
vi.mock('@react-three/fiber', () => ({
  __esModule: true,
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
}))
vi.mock('custom/home-scene', () => ({
  __esModule: true,
  default: () => <div data-testid="home-scene">HomeScene</div>,
}))

// Mock Button and framer-motion
vi.mock('ui/button', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    asChild,
    className,
    onMouseEnter,
    onMouseLeave,
  }: any) =>
    asChild ? (
      <span
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
      >
        {children}
      </span>
    ) : (
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
      >
        {children}
      </button>
    ),
}))
vi.mock('framer-motion', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock Link to a simple anchor so we can inspect href
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

const mockedUseBoundStore = vi.mocked(useBoundStore)

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders core structure and content', () => {
    render(<HomePage />)

    expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    expect(screen.getByTestId('main-layout-header')).toBeInTheDocument()
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByTestId('home-scene')).toBeInTheDocument()

    // Title text
    expect(screen.getByText('Quizzz Game')).toBeInTheDocument()
  })

  it('start link points to settings route', () => {
    render(<HomePage />)
    const startLink = screen
      .getAllByRole('link')
      .find((a) => a.textContent?.includes('START')) as HTMLAnchorElement
    expect(startLink).toBeTruthy()
    expect(startLink).toHaveAttribute('href', PathConstants.SETTINGS)
  })

  it('clicking start triggers toggleIsPlay', () => {
    const toggleIsPlay = vi.fn()
    mockedUseBoundStore.mockImplementation((selector: any) =>
      selector({ toggleIsPlay })
    )

    render(<HomePage />)

    const startLink = screen
      .getAllByRole('link')
      .find((a) => a.textContent?.includes('START'))

    if (!startLink) throw new Error('Start link not found')
    fireEvent.click(startLink)

    expect(toggleIsPlay).toHaveBeenCalled()
  })

  it('renders creator link in footer', () => {
    render(<HomePage />)
    const creatorLink = screen.getByRole('link', { name: /contact the creator/i })
    expect(creatorLink).toBeInTheDocument()
    expect(creatorLink).toHaveAttribute('href', 'https://www.linkedin.com/in/tatsiana-bunevich/')
  })

  it('renders custom mouse cursor', () => {
    render(<HomePage />)
    const cursor = document.querySelector('.pointer-events-none.fixed.rounded-full')
    expect(cursor).toBeInTheDocument()
  })
})