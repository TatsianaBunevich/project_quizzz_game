import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MainLayout from './main-layout'
import useResetGame from 'hooks/use-reset-game'
import PathConstants from 'routes/constants'
import { ReactNode } from 'react'

// Mock useResetGame
vi.mock('hooks/use-reset-game', () => ({
  default: vi.fn(() => vi.fn()),
}))

// Mock Link and Button to avoid implementation details
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: vi.fn(({ children, to }: { children: ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    )),
  }
})

vi.mock('ui/button', () => ({
  Button: vi.fn(
    ({
      children,
      onClick,
      className,
    }: {
      children: ReactNode
      onClick?: () => void
      className?: string
    }) => (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    )
  ),
}))

vi.mock('ui/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle" />,
}))

describe('MainLayout', () => {
  describe('MainLayout', () => {
    it('renders with children and applies the correct className', () => {
      render(
        <MainLayout className="custom-class">
          <div>Test Content</div>
        </MainLayout>
      )

      const layout = screen.getByText('Test Content').parentElement
      expect(layout).toHaveClass('bg-light-sky dark:bg-dark-sky')
      expect(layout).toHaveClass('custom-class')
    })
  })

  describe('Header', () => {
    it('renders with the correct className and fixed position if isFixed is true', () => {
      render(
        <MemoryRouter>
          <MainLayout.Header isFixed />
        </MemoryRouter>
      )

      // Use ARIA role 'banner' to find the <header> element
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('fixed')
      expect(header).toHaveClass('top-0')
      expect(header).toHaveClass('w-full')
    })

    it('calls resetGame when the logo button is clicked', () => {
      const mockResetGame = vi.fn()
      vi.mocked(useResetGame).mockReturnValue(mockResetGame)

      render(
        <MemoryRouter>
          <MainLayout.Header />
        </MemoryRouter>
      )

      const logoButton = screen.getByRole('button')
      fireEvent.click(logoButton)

      expect(mockResetGame).toHaveBeenCalledTimes(1)
    })

    it('renders the Link with the correct "to" prop', () => {
      render(
        <MemoryRouter>
          <MainLayout.Header />
        </MemoryRouter>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', PathConstants.HOME)
    })
  })

  describe('Main', () => {
    it('renders with children and applies the correct className', () => {
      render(
        <MainLayout.Main className="custom-class">
          <div>Main Content</div>
        </MainLayout.Main>
      )

      const main = screen.getByText('Main Content').parentElement
      expect(main).toHaveClass('container')
      expect(main).toHaveClass('custom-class')
    })
  })

  describe('Footer', () => {
    it('renders with children and applies the correct className', () => {
      render(
        <MainLayout.Footer className="custom-class">
          <div>Footer Content</div>
        </MainLayout.Footer>
      )

      const footer = screen.getByText('Footer Content').parentElement
      expect(footer).toHaveClass('container')
      expect(footer).toHaveClass('custom-class')
    })

    it('applies absolute styles if isAbsolute is true', () => {
      render(
        <MainLayout.Footer isAbsolute className="custom-class">
          <div>Footer Content</div>
        </MainLayout.Footer>
      )

      const footer = screen.getByText('Footer Content').parentElement
      expect(footer).not.toHaveClass('container')
      expect(footer).toHaveClass('custom-class')
    })
  })
})
