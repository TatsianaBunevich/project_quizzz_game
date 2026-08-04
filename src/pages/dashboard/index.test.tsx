import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ResultPage from './index'
import { Score } from './../../types'

// Mock the custom components and the store
vi.mock('custom/result-data', () => ({
  default: ({ score, goal }: { score: Score; goal: number }) => (
    <div data-testid="result-data">
      Score: {score}, Goal: {goal}
    </div>
  ),
}))

vi.mock('custom/result-scoreboard', () => ({
  default: ({ scores }: { scores: Score[] }) => (
    <div data-testid="result-scoreboard">Scores: {scores.join(', ')}</div>
  ),
}))

vi.mock('custom/result-answer', () => ({
  default: ({
    quizItem,
    quizItemId,
    handlePrevClick,
    handleNextClick,
    length,
  }) => (
    <div data-testid="result-answer">
      <div>Quiz Item ID: {quizItemId}</div>
      <div>Quiz Item: {quizItem?.question}</div>
      <button onClick={handlePrevClick} data-testid="prev-button">
        Prev
      </button>
      <button onClick={handleNextClick} data-testid="next-button">
        Next
      </button>
      <div>Length: {length}</div>
    </div>
  ),
}))

// Mock the store
vi.mock('store/bound-store', () => ({
  default: vi.fn((selector) => {
    const state = {
      quizItems: [
        { question: 'Question 1' },
        { question: 'Question 2' },
        { question: 'Question 3' },
      ],
      scores: [1, 2, 3],
    }
    return selector(state)
  }),
}))

describe('ResultPage', () => {
  it('renders ResultData and ResultScoreboard with correct props', () => {
    render(<ResultPage />)
    expect(screen.getByTestId('result-data')).toHaveTextContent(
      'Score: 3, Goal: 3'
    )
    expect(screen.getByTestId('result-scoreboard')).toHaveTextContent(
      'Scores: 1, 2, 3'
    )
  })

  it('renders ResultAnswer with the last quiz item by default', () => {
    render(<ResultPage />)
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item ID: 2'
    )
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item: Question 3'
    )
  })

  it('updates quizItemId when Next button is clicked', () => {
    render(<ResultPage />)
    fireEvent.click(screen.getByTestId('next-button'))
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item ID: 3'
    )
  })

  it('updates quizItemId when Prev button is clicked', () => {
    render(<ResultPage />)
    fireEvent.click(screen.getByTestId('prev-button'))
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item ID: 1'
    )
  })

  it('does not go below 0 when Prev button is clicked at the first item', () => {
    render(<ResultPage />)
    // Simulate going to the first item
    fireEvent.click(screen.getByTestId('prev-button'))
    fireEvent.click(screen.getByTestId('prev-button'))
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item ID: 0'
    )
  })

  it('does not exceed quizItems length when Next button is clicked at the last item', () => {
    render(<ResultPage />)
    // Simulate going to the last item
    fireEvent.click(screen.getByTestId('next-button'))
    expect(screen.getByTestId('result-answer')).toHaveTextContent(
      'Quiz Item ID: 3'
    )
  })
})
