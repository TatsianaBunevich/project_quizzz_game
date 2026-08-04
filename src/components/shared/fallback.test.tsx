// Fallback.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Fallback from './fallback'

describe('Fallback', () => {
  const mockError = new Error('Something went wrong')
  const mockResetErrorBoundary = vi.fn()

  it('renders the error message and "Try again" button', () => {
    render(
      <Fallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />
    )

    // Check if the error message is displayed
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Check if the "Try again" button is rendered
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when "Try again" button is clicked', () => {
    render(
      <Fallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />
    )

    // Simulate a click on the "Try again" button
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    // Verify that resetErrorBoundary was called
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1)
  })
})
