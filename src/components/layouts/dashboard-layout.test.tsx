import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './dashboard-layout'
import useBoundStore from 'store/bound-store'
import PathConstants from 'routes/constants'

// Mock useBoundStore default export (zustand store hook)
vi.mock('store/bound-store', () => ({
  __esModule: true,
  default: vi.fn((selector: any) => {
    if (typeof selector === 'function') {
      return selector({ isPlay: false, scores: [] })
    }
    return { isPlay: false, scores: [] }
  }),
}))

// Mock child components to avoid their internals
vi.mock('custom/dashboard-sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-sidebar" />,
}))

vi.mock('custom/dashboard-sheet', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-sheet" />,
}))

vi.mock('ui/mode-toggle', () => ({
  __esModule: true,
  ModeToggle: () => <div data-testid="mode-toggle" />,
}))

const mockedUseBoundStore = vi.mocked(useBoundStore)

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('navigates to HOME if isPlay is false', () => {
    mockedUseBoundStore.mockImplementation((selector: any) => {
      return selector({ isPlay: false, scores: [] })
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path={PathConstants.HOME} element={<div>Home Page</div>} />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('navigates to SETTINGS if scores is empty', () => {
    mockedUseBoundStore.mockImplementation((selector: any) => {
      return selector({ isPlay: true, scores: [] })
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path={PathConstants.SETTINGS}
            element={<div>Settings Page</div>}
          />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Settings Page')).toBeInTheDocument()
  })

  it('renders layout when isPlay is true and scores has entries', () => {
    mockedUseBoundStore.mockImplementation((selector: any) => {
      return selector({
        isPlay: true,
        scores: [
          { id: '1', score: 100, percentage: 10, status: 'bad', time: null },
        ],
      })
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<div>Outlet Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-sheet')).toBeInTheDocument()
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
    expect(screen.getByText('Outlet Content')).toBeInTheDocument()
  })
})
