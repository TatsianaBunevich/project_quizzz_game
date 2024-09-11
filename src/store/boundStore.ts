import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { BoundState, BoundActions } from './types'
import { initialSettingsState, createSettingsActions } from './settingsSlice'
import { initialQuizState, createQuizActions } from './quizSlice'
import { initialScoresState, createScoresActions } from './scoresSlice'
import { initialUtilsState, createUtilsActions } from './utilsSlice'

const initialBoundState: BoundState = {
  ...initialSettingsState,
  ...initialQuizState,
  ...initialScoresState,
  ...initialUtilsState,
}

const useBoundStore = create<BoundState & BoundActions>()(
  devtools(
    persist(
      immer((set, get, api) => ({
        ...initialBoundState,
        ...createSettingsActions(set, get, api),
        ...createQuizActions(set, get, api),
        ...createScoresActions(set, get, api),
        ...createUtilsActions(set, get, api),
        resetBoundStore: () => {
          set({ ...initialBoundState }, false, 'store/resetBoundStore')
        },
      })),
      {
        name: 'bound-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !['activeId', 'timeLeft', 'intervalId'].includes(key)
            )
          ),
      }
    ),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      enabled: process.env.NODE_ENV !== 'production', // Enable/Disable Redux DevTools
      name: 'bound store',
      serialize: {
        options: false,
      },
    }
  )
)

export default useBoundStore
