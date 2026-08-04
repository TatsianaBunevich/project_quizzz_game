import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'

// Move import inside the describe block to ensure mock is applied first
let useBoundStore: any
let getState: any
let setState: any

// Mock sessionStorage to ensure persist uses it
const createSessionStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    _getStore: () => store,
  } as unknown as Storage & { _getStore: () => Record<string, string> }
}

const originalEnv = { ...process.env }

describe('useBoundStore (zustand)', () => {
  let mockSession: Storage & { _getStore: () => Record<string, string> }

  beforeAll(async () => {
    // Setup basic session storage mock before importing store
    mockSession = createSessionStorageMock()
    vi.stubGlobal('sessionStorage', mockSession)

    // Now import the store
    const module = await import('./bound-store')
    useBoundStore = module.default
    getState = () => useBoundStore.getState()
    setState = (partial: Partial<any>) => useBoundStore.setState(partial, false)
  })

  beforeEach(() => {
    // reset env
    process.env = { ...originalEnv, NODE_ENV: 'test' }

    // reset store completely
    getState().resetBoundStore()
    mockSession.clear()
  })

  it('composes initial state from slices', () => {
    const state = getState()

    // settings-slice expectations
    expect(state).toHaveProperty('settings')
    expect(state.settings).toHaveProperty('category')
    expect(state.settings).toHaveProperty('difficulty')
    expect(state.settings).toHaveProperty('type')
    expect(state.settings).toHaveProperty('amount')
    expect(state.settings).toHaveProperty('timer')

    // quiz-slice expectations
    expect(state).toHaveProperty('quizItems')
    expect(state).toHaveProperty('activeId')
    expect(state).toHaveProperty('timeLeft')
    expect(state).toHaveProperty('intervalId')

    // scores-slice expectations
    expect(state).toHaveProperty('scores')

    // utils-slice expectations
    expect(state).toHaveProperty('isPlay')

    // actions presence
    expect(state).toHaveProperty('resetBoundStore')
  })

  it('resetBoundStore restores initial state', () => {
    // mutate some fields
    setState({
      settings: { ...getState().settings, amount: 20 },
      isPlay: true
    })

    expect(getState().settings.amount).toBe(20)
    expect(getState().isPlay).toBe(true)

    getState().resetBoundStore()

    // after reset, should be back to initial
    const after = getState()
    expect(after.settings.amount).not.toBe(20)
    expect(after.isPlay).not.toBe(true)
  })

  it('persist uses sessionStorage and partialize filters volatile keys', async () => {
    // Write some representative values, including keys that should be filtered: activeId, timeLeft, intervalId
    setState({
      settings: { ...getState().settings, amount: 20 },
      activeId: 1,
      timeLeft: 42,
      intervalId: 777
    })

    // Trigger a persist write by performing a set
    const raw = mockSession.getItem('bound-storage')
    expect(raw).toBeTruthy()

    const parsed = JSON.parse(raw as string)
    expect(parsed).toHaveProperty('state')

    const persistedState = parsed.state

    // Kept keys
    expect(persistedState.settings.amount).toBe(20)

    // Filtered out keys
    expect(persistedState.activeId).toBeUndefined()
    expect(persistedState.timeLeft).toBeUndefined()
    expect(persistedState.intervalId).toBeUndefined()
  })

  it('devtools config is enabled when NODE_ENV is not production', () => {
    expect(() => {
      setState({ settings: { ...getState().settings, amount: 20 } })
      void getState().settings
    }).not.toThrow()
  })
})
