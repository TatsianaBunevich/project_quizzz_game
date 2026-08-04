import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useResetGame from './use-reset-game'

// Mock useQueryClient
const mockQueryClientClear = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(() => ({
    clear: mockQueryClientClear,
  })),
}))

// Mock useBoundStore
const mockResetBoundStore = vi.fn()
vi.mock('store/bound-store', () => ({
  default: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        resetBoundStore: mockResetBoundStore,
      })
    }
    return { resetBoundStore: mockResetBoundStore }
  }),
}))

describe('useResetGame', () => {
  it('should call resetBoundStore and queryClient.clear when invoked', () => {
    const { result } = renderHook(() => useResetGame())

    // Invoke the returned function inside act
    act(() => {
      result.current()
    })

    // Assert that both functions were called
    expect(mockResetBoundStore).toHaveBeenCalledTimes(1)
    expect(mockQueryClientClear).toHaveBeenCalledTimes(1)
  })
})
