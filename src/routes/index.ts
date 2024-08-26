import PathConstants from './pathConstants';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import QuizPage from '../pages/QuizPage/QuizPage';
import ResultPage from '../pages/ResultPage/ResultPage';
import AnswersPage from '../pages/AnswersPage/AnswersPage';
import ScoreboardPage from '../pages/ScoreboardPage/ScoreboardPage';
import NoMatchPage from '../pages/NoMatchPage/NoMatchPage';

const routes = [
	{ path: PathConstants.SETTINGS, Component: SettingsPage },
	{ path: PathConstants.QUIZ, Component: QuizPage },
	{ path: PathConstants.RESULT, Component: ResultPage },
	{ path: PathConstants.ANSWERS, Component: AnswersPage },
	{ path: PathConstants.SCOREBOARD, Component: ScoreboardPage },
	{ path: PathConstants.NOMATCH, Component: NoMatchPage }
]

export default routes;
