import { ActionsWithMiddlewares, ScoresState, ScoresActions, QuizState } from './types';
import { Status } from '../types';

export const initialScoresState: ScoresState = {
	scores: [],
}

export const createScoresActions: ActionsWithMiddlewares<
ScoresState & Pick<QuizState, 'sortedQuestions'>,
ScoresActions
> = (set) => ({
	addNewScore: () => {
		set((state) => {
			state.scores.push({
				index: state.scores.length + 1,
				points: 0,
				percentage: 0,
				status: Status.BAD,
				time: 0
			});
		},
		undefined,
		'scores/addNewScore');
	},

	incScoreTime: (time) => {
		set((state) => {
			state.scores[state.scores.length - 1].time += time
		},
		undefined,
		'scores/incScoreTime');
	},

	calculateScore: () => {
		set((state) => {
			const points = state.sortedQuestions.reduce((acc, item) => (
				item.answers.reduce((acc, a) => (a.isSelected && a.isCorrect ? acc + 1 : acc), 0) ? acc + 1 : acc
			), 0);
			const goal = state.sortedQuestions.length;
			const percentage = (points / goal) * 100;
			const step = 100 / 3;
			const status = (percentage >= step * 2) ? Status.GOOD : (percentage >= step ? Status.NORMAL : Status.BAD);
			const score = state.scores[state.scores.length - 1];

			score.points = points;
			score.percentage = Number(percentage.toFixed(0));
			score.status = status;
		},
		undefined,
		'scores/calculateScore');
	},

	resetScores: () => {
		set({ ...initialScoresState },
			undefined,
			'scores/resetScores');
	},
});
