interface Category {
  id: number
  name: string
}

export interface CategoriesResponse {
  trivia_categories: Category[]
}

interface Question {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  answers: string[]
}

export interface QuestionsResponse {
  results: Question[]
}

export enum DifficultyType {
  ANY = 'any',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum TypeItem {
  ANY = 'any',
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean',
}

export type IdType = string | DifficultyType | TypeItem

export interface SettingType {
  id: IdType
  name: string
  isSelected: boolean
}

export interface SettingsType {
  category: SettingType[]
  difficulty: SettingType[]
  type: SettingType[]
  amount: number
  timer: number
}

export interface Answer {
  answer: string
  isCorrect: boolean
  isSelected: boolean
}

export interface QuizItemType {
  question: string
  answers: Answer[]
}

export enum Status {
  GOOD = 'good',
  NORMAL = 'normal',
  BAD = 'bad',
}

export interface Score {
  index: number
  points: number
  percentage: number
  status: Status
  time: number | null
}
