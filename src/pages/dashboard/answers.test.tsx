import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnswersPage from './answers'

// Mock the store
vi.mock('store/bound-store', () => ({
  default: vi.fn((selector: any) => {
    const mockQuizItems = [
      { question: 'Question 1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
    ]
    return selector({ quizItems: mockQuizItems })
  }),
}))

// Mock the AnswersItem component
vi.mock('custom/answers-item', () => ({
  // Provide a simple mock that ignores TypeScript-specific prop typing
  // and accepts any props shape used in the test
  default: ({
    quizItem,
    index,
  }: {
    quizItem: { question: string }
    index: number
  }) => (
    <div data-testid="answers-item">
      {index}. {quizItem.question}
    </div>
  ),
}))

// Mock the ScrollArea and ScrollBar components
vi.mock('ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: any }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
  ScrollBar: () => <div data-testid="scroll-bar" />,
}))

describe('AnswersPage', () => {
  it('renders the component', () => {
    render(<AnswersPage />)
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-bar')).toBeInTheDocument()
  })

  it('renders AnswersItem for each quizItem', () => {
    render(<AnswersPage />)
    const items = screen.getAllByTestId('answers-item')
    expect(items.length).toBe(2)
    expect(items[0]).toHaveTextContent('1. Question 1')
    expect(items[1]).toHaveTextContent('2. Question 2')
  })

  it('matches snapshot', () => {
    const { asFragment } = render(<AnswersPage />)
    expect(asFragment()).toMatchSnapshot()
  })
})
