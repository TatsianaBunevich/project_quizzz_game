import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ScoreboardPage from './scoreboard'
import useBoundStore from 'store/bound-store'

// Mock the store
const mockResetScores = vi.fn()
const mockResetQuiz = vi.fn()

vi.mock('store/bound-store', () => ({
  default: vi.fn((selector) => {
    const mockState = {
      scores: [
        { id: '1', name: 'Player 1', score: 10 },
        { id: '2', name: 'Player 2', score: 20 },
      ],
      resetScores: mockResetScores,
      resetQuiz: mockResetQuiz,
    }
    return selector(mockState)
  }),
}))

// Mock child components
vi.mock('custom/scoreboard-table', () => ({
  default: ({
    scores,
  }: {
    scores: Array<{ id: string; name: string; score: number }>
  }) => (
    <div data-testid="scoreboard-table">
      {scores.map((score) => (
        <div key={score.id}>
          {score.name}: {score.score}
        </div>
      ))}
    </div>
  ),
}))

vi.mock('ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
  ScrollBar: () => <div data-testid="scroll-bar" />,
}))

vi.mock('ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

describe('ScoreboardPage', () => {
  it('renders the scoreboard table with scores', () => {
    render(<ScoreboardPage />)
    expect(screen.getByTestId('scoreboard-table')).toBeInTheDocument()
    expect(screen.getByText('Player 1: 10')).toBeInTheDocument()
    expect(screen.getByText('Player 2: 20')).toBeInTheDocument()
  })

  it('calls resetScores and resetQuiz when the Clear button is clicked', () => {
    render(<ScoreboardPage />)
    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    expect(mockResetScores).toHaveBeenCalled()
    expect(mockResetQuiz).toHaveBeenCalled()
  })

  it('renders the ScrollArea and ScrollBar', () => {
    render(<ScoreboardPage />)
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-bar')).toBeInTheDocument()
  })
})
