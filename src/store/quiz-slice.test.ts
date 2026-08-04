import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { createQuizActions } from './quiz-slice'
import { initialQuizState } from './quiz-slice'
import {
  SettingsState,
  QuizActions,
  ScoresActions,
  UtilsState,
  UtilsActions,
} from './types'

describe('createQuizActions', () => {
  let set: any
  let get: any
  let actions: any

  const mockSettingsState: SettingsState = {
    settings: {
      category: [],
      difficulty: [],
      type: [],
      amount: 10,
      timer: 30,
    },
  }

  const mockUtilsState: UtilsState = {
    isPlay: false,
    timeLeft: 30,
    intervalId: null,
  }

  const mockScoresActions: Partial<ScoresActions> = {
    addNewScore: vi.fn(),
    incScoreTime: vi.fn(),
    calculateScore: vi.fn(),
  }

  const mockUtilsActions: Partial<UtilsActions> = {
    setTimeLeft: vi.fn(),
    runIntervalId: vi.fn(),
    clearIntervalId: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Use a shared state object for the tests
    let currentState = {
      ...initialQuizState,
      ...mockSettingsState,
      ...mockUtilsState,
    }

    // Mock zustand set function to actually update the shared state
    set = vi.fn((updater) => {
      if (typeof updater === 'function') {
        const newState = updater(currentState)
        if (newState !== undefined) {
          currentState = { ...currentState, ...newState }
        }
      } else {
        currentState = { ...currentState, ...updater }
      }
    })

    // 1. Create the raw actions
    const rawActions = createQuizActions(set, () => {
      return {
        ...currentState,
        ...spiedActions,
        ...mockScoresActions,
        ...mockUtilsActions,
      }
    })

    // 2. Create spied versions of all raw actions
    const spiedActions: any = {}
    Object.entries(rawActions).forEach(([key, value]) => {
      if (typeof value === 'function') {
        spiedActions[key] = vi.fn().mockImplementation(value)
      } else {
        spiedActions[key] = value
      }
    })

    // Redefine get to return the current state + spied actions
    get = vi.fn().mockImplementation(() => ({
      ...currentState,
      ...spiedActions,
      ...mockScoresActions,
      ...mockUtilsActions,
    }))

    actions = spiedActions
  })

  describe('sortQuizItems', () => {
    it('should map and shuffle questions when data is provided', () => {
      const mockData = {
        results: [
          {
            question: 'Q1',
            correct_answer: 'A1',
            incorrect_answers: ['I1', 'I2', 'I3'],
          },
        ],
      }

      actions.sortQuizItems(mockData)

      expect(set).toHaveBeenCalled()
      expect(get().quizItems).toHaveLength(1)
      expect(get().quizItems[0].question).toBe('Q1')
    })

    it('should use existing quizItems when no data is provided', () => {
      set({ quizItems: [{ question: 'Existing', answers: [] }] })
      actions.sortQuizItems(null)
      expect(set).toHaveBeenCalled()
      expect(get().quizItems).toHaveLength(1)
    })
  })

  describe('startCountdown', async () => {
    it('should set time to 5 and run interval', async () => {
      get().runIntervalId.mockImplementation((cb: any) => cb())

      const countdown = actions.startCountdown()
      expect(get().setTimeLeft).toHaveBeenCalledWith(5)
      expect(get().runIntervalId).toHaveBeenCalled()
      await countdown
    })
  })

  describe('startTimer', () => {
    it('should use provided timer value', () => {
      actions.startTimer(15, () => {})
      expect(get().setTimeLeft).toHaveBeenCalledWith(15)
    })

    it('should fallback to settings.timer if no value provided', () => {
      actions.startTimer(undefined, () => {})
      expect(get().setTimeLeft).toHaveBeenCalledWith(30)
    })
  })

  describe('handleSelectAnswer', () => {
    it('should toggle answer selection', () => {
      const mockQuizItems = [
        {
          question: 'Q1',
          answers: [
            { answer: 'A1', isCorrect: true, isSelected: false },
            { answer: 'A2', isCorrect: false, isSelected: false },
          ],
        },
      ]
      set({ quizItems: mockQuizItems })

      actions.handleSelectAnswer(0, 'A1')
      expect(get().quizItems[0].answers[0].isSelected).toBe(true)

      actions.handleSelectAnswer(0, 'A1')
      expect(get().quizItems[0].answers[0].isSelected).toBe(false)
    })
  })

  describe('handlePrevButton', () => {
    it('should reset quiz if activeId is 0', () => {
      set({ activeId: 0 })
      actions.handlePrevButton()
      expect(get().resetQuiz).toHaveBeenCalled()
    })

    it('should decrement activeId if activeId > 0', () => {
      set({ activeId: 1 })
      actions.handlePrevButton()
      expect(get().decActiveId).toHaveBeenCalled()
    })

    it('should clear interval if timer is active', () => {
      set({
        settings: { ...mockSettingsState.settings, timer: 30 },
        intervalId: 123,
      })
      actions.handlePrevButton()
      expect(get().clearIntervalId).toHaveBeenCalled()
    })
  })

  describe('handleNextButton', () => {
    it('should increment activeId if not at the end', () => {
      set({ activeId: 0, quizItems: new Array(5) })
      actions.handleNextButton()
      expect(get().incActiveId).toHaveBeenCalled()
    })

    it('should calculate score if at the end', () => {
      set({ activeId: 4, quizItems: new Array(5) })
      actions.handleNextButton()
      expect(get().calculateScore).toHaveBeenCalled()
    })

    it('should clear interval and incScoreTime if timer is active', () => {
      set({
        settings: { ...mockSettingsState.settings, timer: 30 },
        timeLeft: 10,
        intervalId: 123,
      })
      actions.handleNextButton()
      expect(get().clearIntervalId).toHaveBeenCalled()
      expect(get().incScoreTime).toHaveBeenCalledWith(20)
    })
  })

  describe('incActiveId', () => {
    it('should increment activeId', () => {
      set({ activeId: 0 })
      actions.incActiveId()
      expect(set).toHaveBeenCalled()
    })
  })

  describe('decActiveId', () => {
    it('should decrement activeId', () => {
      set({ activeId: 1 })
      actions.decActiveId()
      expect(set).toHaveBeenCalled()
    })
  })

  describe('resetQuiz', () => {
    it('should reset to initialQuizState', () => {
      set({ activeId: 5, quizItems: [{ question: 'Q', answers: [] }] })
      actions.resetQuiz()
      expect(get().activeId).toBe(initialQuizState.activeId)
      expect(get().quizItems).toEqual(initialQuizState.quizItems)
    })
  })

  describe('stopTimer', () => {
    it('should call clearIntervalId', () => {
      actions.stopTimer()
      expect(get().clearIntervalId).toHaveBeenCalled()
    })
  })

  describe('restartTimer', () => {
    it('should call startTimer with current timeLeft', () => {
      set({ timeLeft: 15 })
      actions.restartTimer()
      expect(get().startTimer).toHaveBeenCalledWith(15)
    })
  })

  describe('handleNewTry', () => {
    it('should reset activeId, clear selections, reshuffle, and add score', () => {
      set({
        activeId: 5,
        quizItems: [
          {
            question: 'Q',
            answers: [{ answer: 'A', isCorrect: true, isSelected: true }],
          },
        ],
      })
      actions.handleNewTry()

      expect(get().activeId).toBe(initialQuizState.activeId)
      expect(get().quizItems[0].answers[0].isSelected).toBe(false)
      expect(get().sortQuizItems).toHaveBeenCalled()
      expect(get().addNewScore).toHaveBeenCalled()
    })
  })
})
