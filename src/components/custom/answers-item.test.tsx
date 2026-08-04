import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import AnswersItem from './answers-item'
import { QuizItemType } from '@/types'

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <div data-testid="card-title" className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <div data-testid="badge" data-variant={variant}>
      {children}
    </div>
  ),
}))

vi.mock('ui/button', () => ({
  __esModule: true,
  Button: ({ children, className, variant }: any) => (
    <button
      data-testid="answer-button"
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}))

vi.mock('custom/displayed-answer', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="displayed-answer">{text}</div>
  ),
}))

describe('AnswersItem', () => {
  const mockQuizItem: QuizItemType = {
    question: 'What is 2 + 2?',
    answers: [
      { answer: '3', isCorrect: false, isSelected: false },
      { answer: '4', isCorrect: true, isSelected: false },
      { answer: '5', isCorrect: false, isSelected: false },
      { answer: '6', isCorrect: false, isSelected: false },
    ],
  }

  it('renders correctly with a quizItem and index', () => {
    render(<AnswersItem quizItem={mockQuizItem} index={1} />)

    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getAllByTestId('answer-button')).toHaveLength(4)
  })

  it('shows "Unanswered" status when no answer is selected', () => {
    render(<AnswersItem quizItem={mockQuizItem} index={1} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('Unanswered')
  })

  it('shows "Correct" status when the correct answer is selected', () => {
    const itemWithCorrectAnswer = {
      ...mockQuizItem,
      answers: mockQuizItem.answers.map((a, i) =>
        i === 1 ? { ...a, isSelected: true } : a
      ),
    }
    render(<AnswersItem quizItem={itemWithCorrectAnswer} index={1} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('Correct')
  })

  it('shows "Incorrect" status when a wrong answer is selected', () => {
    const itemWithWrongAnswer = {
      ...mockQuizItem,
      answers: mockQuizItem.answers.map((a, i) =>
        i === 0 ? { ...a, isSelected: true } : a
      ),
    }
    render(<AnswersItem quizItem={itemWithWrongAnswer} index={1} />)
    expect(screen.getByTestId('badge')).toHaveTextContent('Incorrect')
  })

  it('applies lime-500 class when the selected answer is correct', () => {
    const itemWithCorrectAnswer = {
      ...mockQuizItem,
      answers: mockQuizItem.answers.map((a, i) =>
        i === 1 ? { ...a, isSelected: true } : a
      ),
    }
    render(<AnswersItem quizItem={itemWithCorrectAnswer} index={1} />)

    const buttons = screen.getAllByTestId('answer-button')
    expect(buttons[1]).toHaveClass('before:bg-lime-500')
  })

  it('applies red-500 class when the selected answer is incorrect', () => {
    const itemWithWrongAnswer = {
      ...mockQuizItem,
      answers: mockQuizItem.answers.map((a, i) =>
        i === 0 ? { ...a, isSelected: true } : a
      ),
    }
    render(<AnswersItem quizItem={itemWithWrongAnswer} index={1} />)

    const buttons = screen.getAllByTestId('answer-button')
    expect(buttons[0]).toHaveClass('before:bg-red-500')
  })

  it('renders the question using dangerouslySetInnerHTML', () => {
    const itemWithHtml = {
      ...mockQuizItem,
      question: 'What is <b>2 + 2</b>?',
    }
    render(<AnswersItem quizItem={itemWithHtml} index={1} />)

    const title = screen.getByTestId('card-title')
    expect(title.innerHTML).toContain('<b>2 + 2</b>')
  })
})
