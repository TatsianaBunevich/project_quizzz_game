import { ActionsWithMiddlewares, SettingsState, SettingsActions } from './types'
import { DEFAULTSETTINGS } from '@/constants'

export const initialSettingsState: SettingsState = {
  settings: structuredClone(DEFAULTSETTINGS),
}

export const createSettingsActions: ActionsWithMiddlewares<
  SettingsState,
  SettingsActions
> = (set) => ({
  updateSettings: (data) => {
    set(
      (state) => {
        const triviaCategories = data.trivia_categories.map((category) => ({
          id: category.id.toString(),
          name: category.name,
          isSelected: false,
        }))
        state.settings.category.push(...triviaCategories)
      },
      undefined,
      'settings/updateSettings'
    )
  },

  handleSelectOption: (optionId, setting) => {
    set(
      (state) => {
        if (setting === 'amount' || setting === 'timer') {
          state.settings[setting] = optionId as number
        } else {
          const settingsArray = state.settings[setting]
          const foundItem = settingsArray.find((item) => item.id === optionId)

          settingsArray.forEach((item) => (item.isSelected = false))

          if (foundItem) {
            foundItem.isSelected = true
          }
        }
      },
      undefined,
      'settings/handleSelectOption'
    )
  },
})
