import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createScoresActions, initialScoresState } from './scores-slice'
import { Status } from '@/types'

describe('createScoresActions', () => {
  let set: any
  let actions: any
  let currentState: any

  const mockSettingsState = {
    settings: { timer: 30 },
  }

  const mockQuizState = {
    quizItems: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset state to initial for every test to ensure isolation
    currentState = {
      ...initialScoresState,
      ...mockSettingsState,
      ...mockQuizState,
      scores: [] // Ensure empty array
    }

    set = vi.fn((updater) => {
      if (typeof updater === 'function') {
        updater(currentState)
      } else {
        // Important: When resetting, we must clone the initial state to avoid reference sharing
        if (updater === initialScoresState) {
          currentState.scores = JSON.parse(JSON.stringify(initialScoresState.scores))
        } else {
          currentState = { ...currentState, ...updater }
        }
      }
    })

    actions = createScoresActions(set)
  })

  describe('addNewScore', () => {
    it('should add a new score object to the scores array', () => {
      actions.addNewScore()

      expect(set).toHaveBeenCalled()
      expect(currentState.scores).toHaveLength(1)
      expect(currentState.scores[0]).toEqual({
        index: 1,
        points: 0,
        percentage: 0,
        status: Status.BAD,
        time: 0,
      })
    })

    it('should set time to null if timer is 0', () => {
      // Modify timer in the state the action will use
      currentState.settings = { ...mockSettingsState.settings, timer: 0 }
      actions.addNewScore()

      expect(currentState.scores[0].time).toBeNull()
    })

    it('should increment the index for subsequent scores', () => {
      actions.addNewScore()
      actions.addNewScore()

      expect(currentState.scores).toHaveLength(2)
      expect(currentState.scores[1].index).toBe(2)
    })
  })

  describe('incScoreTime', () => {
    it('should increment the time of the last score', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: 10 }]

      actions.incScoreTime(5)

      expect(currentState.scores[0].time).toBe(15)
    })

    it('should do nothing if no scores exist', () => {
      currentState.scores = []

      actions.incScoreTime(5)

      expect(currentState.scores).toHaveLength(0)
    })

    it('should do nothing if the last score time is null', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: null }]

      actions.incScoreTime(5)

      expect(currentState.scores[0].time).toBeNull()
    })
  })

  describe('calculateScore', () => {
    it('should calculate correct points and percentage for correct answers', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: 0 }]
      currentState.quizItems = [
        {
          question: 'Q1',
          answers: [{ answer: 'A1', isCorrect: true, isSelected: true }],
        },
        {
          question: 'Q2',
          answers: [{ answer: 'A2', isCorrect: true, isSelected: true }],
        },
        {
          question: 'Q3',
          answers: [{ answer: 'A3', isCorrect: false, isSelected: true }],
        },
      ]

      actions.calculateScore()

      expect(currentState.scores[0].points).toBe(2)
      expect(currentState.scores[0].percentage).toBe(67)
    })

    it('should set status to GOOD for high percentages', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: 0 }]
      currentState.quizItems = [
        {
          question: 'Q1',
          answers: [{ answer: 'A1', isCorrect: true, isSelected: true }],
        },
      ]

      actions.calculateScore()

      expect(currentState.scores[0].status).toBe(Status.GOOD)
    })

    it('should set status to NORMAL for medium percentages', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: 0 }]
      // goal = 2, points = 1 => 50%
      // step = 100/3 = 33.33.
      // percentage >= step (50 >= 33.33) AND percentage < step * 2 (50 < 66.66) -> NORMAL
      currentState.quizItems = [
        {
          question: 'Q1',
          answers: [{ answer: 'A1', isCorrect: true, isSelected: true }],
        },
        {
          question: 'Q2',
          answers: [{ answer: 'A2', isCorrect: false, isSelected: true }],
        },
      ]

      actions.calculateScore()

      expect(currentState.scores[0].status).toBe(Status.NORMAL)
    })

    it('should set status to BAD for low percentages', () => {
      currentState.scores = [{ index: 1, points: 0, percentage: 0, status: Status.BAD, time: 0 }]
      currentState.quizItems = [
        {
          question: 'Q1',
          answers: [{ answer: 'A1', isCorrect: false, isSelected: true }],
        },
        {
          question: 'Q2',
          answers: [{ answer: 'A2', isCorrect: false, isSelected: true }],
        },
        {
          question: 'Q3',
          answers: [{ answer: 'A3', isCorrect: false, isSelected: true }],
        },
      ]

      actions.calculateScore()

      expect(currentState.scores[0].status).toBe(Status.BAD)
    })
  })

  describe('resetScores', () => {
    it('should clear the scores array', () => {
      currentState.scores = [{ index: 1, points: 10, percentage: 100, status: Status.GOOD, time: 5 }]

      actions.resetScores()

      expect(currentState.scores).toEqual(initialScoresState.scores)
      expect(currentState.scores).toHaveLength(0)
    })
  })
})
