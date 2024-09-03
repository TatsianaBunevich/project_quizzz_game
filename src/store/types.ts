import { StateCreator } from 'zustand'
import {
  SettingsType,
  IdType,
  QuizItemType,
  Score,
  CategoriesResponse,
  QuestionsResponse,
} from '../types'

export type ActionsWithMiddlewares<T, U = T> = StateCreator<
  T,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  U
>

export interface SettingsState {
  settings: SettingsType
}

export interface QuizState {
  quizItems: QuizItemType[]
  activeId: number
}

export interface ScoresState {
  scores: Score[]
}

export interface UtilsState {
  isPlay: boolean
  timeLeft: number
  intervalId: number | null
}

export interface SettingsActions {
  updateSettings: (data: CategoriesResponse) => void
  handleSelectOption: (
    optionId: IdType | number,
    setting: keyof SettingsType
  ) => void
}

export interface QuizActions {
  sortQuizItems: (data?: QuestionsResponse) => void
  startCountdown: () => Promise<void>
  startTimer: (timer?: number, callback?: () => void) => void
  handleSelectAnswer: (id: number, a: string) => void
  handlePrevButton: () => void
  handleNextButton: () => void
  incActiveId: () => void
  decActiveId: () => void
  resetQuiz: () => void
  stopTimer: () => void
  restartTimer: () => void
  handleNewTry: () => void
}

export interface ScoresActions {
  addNewScore: () => void
  incScoreTime: (time: number) => void
  calculateScore: () => void
  resetScores: () => void
}

export interface UtilsActions {
  toggleIsPlay: () => void
  setTimeLeft: (timeLeft: number) => void
  runIntervalId: (callback: () => void) => void
  clearIntervalId: () => void
}

export interface BoundState
  extends SettingsState,
    QuizState,
    ScoresState,
    UtilsState {}

export interface BoundActions
  extends SettingsActions,
    QuizActions,
    ScoresActions,
    UtilsActions {
  resetBoundStore: () => void
}
