import {
  ActionsWithMiddlewares,
  ScoresState,
  ScoresActions,
  QuizState,
  SettingsState,
} from './types'
import { Status } from '@/types'

export const initialScoresState: ScoresState = {
  scores: [],
}

export const createScoresActions: ActionsWithMiddlewares<
  ScoresState & Pick<QuizState, 'quizItems'> & Pick<SettingsState, 'settings'>,
  ScoresActions
> = (set) => ({
  addNewScore: () => {
    set(
      (state) => {
        state.scores.push({
          index: state.scores.length + 1,
          points: 0,
          percentage: 0,
          status: Status.BAD,
          time: state.settings.timer === 0 ? null : 0,
        })
      },
      undefined,
      'scores/addNewScore'
    )
  },

  incScoreTime: (time) => {
    set(
      (state) => {
        const lastScore = state.scores[state.scores.length - 1]
        if (lastScore && lastScore.time !== null) {
          lastScore.time += time
        }
      },
      undefined,
      'scores/incScoreTime'
    )
  },

  calculateScore: () => {
    set(
      (state) => {
        const points = state.quizItems.reduce(
          (acc, item) =>
            item.answers.reduce(
              (acc, a) => (a.isSelected && a.isCorrect ? acc + 1 : acc),
              0
            )
              ? acc + 1
              : acc,
          0
        )
        const goal = state.quizItems.length
        const percentage = (points / goal) * 100
        const step = 100 / 3
        const score = state.scores[state.scores.length - 1]

        score.points = points
        score.percentage = Number(percentage.toFixed(0))
        score.status =
          percentage >= step * 2
            ? Status.GOOD
            : percentage >= step
              ? Status.NORMAL
              : Status.BAD
      },
      undefined,
      'scores/calculateScore'
    )
  },

  resetScores: () => {
    set({ ...initialScoresState }, undefined, 'scores/resetScores')
  },
})
