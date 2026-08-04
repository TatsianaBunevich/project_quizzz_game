import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSettingsActions, initialSettingsState } from './settings-slice'
import { CategoriesResponse } from './types'

describe('createSettingsActions', () => {
  let set: any
  let actions: any
  let currentState: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Deep clone initial state to avoid mutation across tests
    currentState = JSON.parse(JSON.stringify(initialSettingsState))

    set = vi.fn((updater) => {
      if (typeof updater === 'function') {
        updater(currentState)
      } else {
        currentState = { ...currentState, ...updater }
      }
    })

    actions = createSettingsActions(set)
  })

  describe('updateSettings', () => {
    it('should map and add trivia categories to state', () => {
      const mockData: CategoriesResponse = {
        trivia_categories: [
          { id: 1, name: 'Science' },
          { id: 2, name: 'History' },
        ],
      }

      actions.updateSettings(mockData)

      expect(set).toHaveBeenCalled()
      // Check if the new categories were added to the initial categories (which usually has 'Any')
      const categories = currentState.settings.category
      expect(categories).toContainEqual({
        id: '1',
        name: 'Science',
        isSelected: false,
      })
      expect(categories).toContainEqual({
        id: '2',
        name: 'History',
        isSelected: false,
      })
    })
  })

  describe('handleSelectOption', () => {
    it('should update amount when setting is "amount"', () => {
      actions.handleSelectOption(20, 'amount')

      expect(currentState.settings.amount).toBe(20)
    })

    it('should update timer when setting is "timer"', () => {
      actions.handleSelectOption(15, 'timer')

      expect(currentState.settings.timer).toBe(15)
    })

    it('should select an option in an array and deselect others', () => {
      // Setup: multiple items selected (though normally only one should be)
      currentState.settings.difficulty = [
        { id: 'easy', name: 'Easy', isSelected: true },
        { id: 'medium', name: 'Medium', isSelected: false },
        { id: 'hard', name: 'Hard', isSelected: false },
      ]

      // Select 'medium'
      actions.handleSelectOption('medium', 'difficulty')

      expect(currentState.settings.difficulty).toEqual([
        { id: 'easy', name: 'Easy', isSelected: false },
        { id: 'medium', name: 'Medium', isSelected: true },
        { id: 'hard', name: 'Hard', isSelected: false },
      ])
    })

    it('should toggle off an already selected option', () => {
      currentState.settings.type = [
        { id: 'multiple', name: 'Multiple Choice', isSelected: true },
      ]

      // Select 'multiple' again to toggle it off
      actions.handleSelectOption('multiple', 'type')

      expect(currentState.settings.type[0].isSelected).toBe(false)
    })

    it('should do nothing if optionId is not found in the array', () => {
      const originalDifficulty = JSON.parse(
        JSON.stringify(currentState.settings.difficulty)
      )

      actions.handleSelectOption('non-existent', 'difficulty')

      expect(currentState.settings.difficulty).toEqual(originalDifficulty)
    })
  })
})
