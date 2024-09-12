import PathConstants from 'routes/pathConstants'
import DashboardLayout from 'layouts/dashboard-layout'
import HomePage from 'pages/home'
import SettingsPage from 'pages/settings'
import QuizPage from 'pages/quiz'
import ResultPage from 'pages/dashboard'
import AnswersPage from 'pages/AnswersPage/AnswersPage'
import ScoreboardPage from 'pages/ScoreboardPage/ScoreboardPage'
import NoMatchPage from 'pages/no-match'

const routes = [
  { index: true, Component: HomePage },
  { path: PathConstants.SETTINGS, Component: SettingsPage },
  { path: PathConstants.QUIZ, Component: QuizPage },
  { path: PathConstants.NOMATCH, Component: NoMatchPage },
  {
    Component: DashboardLayout,
    children: [
      { path: PathConstants.RESULT, Component: ResultPage },
      { path: PathConstants.ANSWERS, Component: AnswersPage },
      { path: PathConstants.SCOREBOARD, Component: ScoreboardPage },
    ],
  },
]

export default routes
