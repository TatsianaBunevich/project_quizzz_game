import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createUtilsActions, initialUtilsState } from './utils-slice'

describe('createUtilsActions', () => {
  let set: any
  let get: any
  let currentState: any
  let actions: any

  beforeEach(() => {
    vi.useFakeTimers()

    // Initialize state
    currentState = { ...initialUtilsState }

    // Mock get to return the current state (which will include actions)
    get = vi.fn(() => currentState)

    // Mock set to update our local currentState
    set = vi.fn((updater, replace, name) => {
      if (typeof updater === 'function') {
        const result = updater(currentState)
        if (result !== undefined) {
          currentState = { ...currentState, ...result }
        }
      } else {
        currentState = { ...currentState, ...updater }
      }
    })

    // Create actions using the mocks
    actions = createUtilsActions(set, get)

    // Add actions to the state so that get().clearIntervalId() etc. works
    currentState = { ...currentState, ...actions }
  })

  afterEach(() => {
    vi.useRealTimers()
    if (currentState.intervalId) {
      clearInterval(currentState.intervalId)
    }
  })

  it('should toggle isPlay', () => {
    actions.toggleIsPlay()
    expect(currentState.isPlay).toBe(true)
    actions.toggleIsPlay()
    expect(currentState.isPlay).toBe(false)
  })

  it('should set timeLeft', () => {
    actions.setTimeLeft(10)
    expect(currentState.timeLeft).toBe(10)
  })

  describe('runIntervalId', () => {
    it('should start interval and decrement timeLeft', () => {
      currentState.timeLeft = 5
      actions.runIntervalId(() => {})

      expect(currentState.intervalId).not.toBeNull()

      vi.advanceTimersByTime(1000)
      expect(currentState.timeLeft).toBe(4)
    })

    it('should call callback and clear interval when timeLeft reaches 0', () => {
      const callback = vi.fn()
      currentState.timeLeft = 1
      actions.runIntervalId(callback)

      vi.advanceTimersByTime(1000)

      expect(callback).toHaveBeenCalled()
      expect(currentState.intervalId).toBeNull()
    })

    it('should not start multiple intervals if one is already running', () => {
      currentState.timeLeft = 5
      actions.runIntervalId(() => {})
      const firstId = currentState.intervalId

      actions.runIntervalId(() => {})
      expect(currentState.intervalId).toBe(firstId)
    })
  })

  describe('clearIntervalId', () => {
    it('should clear interval and reset intervalId to null', () => {
      currentState.timeLeft = 5
      actions.runIntervalId(() => {})
      expect(currentState.intervalId).not.toBeNull()

      actions.clearIntervalId()
      expect(currentState.intervalId).toBeNull()
    })

    it('should not throw if intervalId is already null', () => {
      currentState.intervalId = null
      expect(() => actions.clearIntervalId()).not.toThrow()
      expect(currentState.intervalId).toBeNull()
    })
  })
})
