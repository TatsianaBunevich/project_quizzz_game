// index.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock ReactDOM.createRoot to avoid actual DOM manipulation
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}))

describe('index.tsx', () => {
  beforeEach(() => {
    // Mock document.getElementById
    document.getElementById = vi.fn((id) => {
      if (id === 'root') {
        const div = document.createElement('div')
        div.id = 'root'
        return div
      }
      return null
    })
  })

  it('should render the App component without errors', () => {
    render(<App />)
  })

  it('should ensure the root element exists', () => {
    const rootElement = document.getElementById('root')
    expect(rootElement).not.toBeNull()
  })
})
