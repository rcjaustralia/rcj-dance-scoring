/*exports.Division = require('./division');
exports.Team = require('./team');
exports.DanceInterview = require('./dance_interview');
exports.DancePerformance = require('./dance_performance');
exports.Dance = require('./dance');
exports.DanceTheatrePerformance = require('./dance_theatre_performance');
exports.DanceTheatre = require('./dance_theatre');
exports.User = require('./users');
exports.DanceExport = require('./dance_export');
exports.ScoreSheet = require('./score_sheet_template');
exports.SubmittedScore = require('./submitted_score');
exports.Ladder = require('./ladder');
*/

exports.Division = require('./division');
exports.User = require('./users');
exports.ScoreSheet = require('./score_sheet_template');
exports.Team = require('./team');
exports.Ladder = require('./ladder');
exports.SubmittedScore = require('./submitted_score');
exports.Ping = require('./ping');
exports.DanceExport = require('./dance_export');

exports.mount = function(router) {
	router.get('/ping', exports.Ping.ping);

	router.post('/login', exports.User.login);
	router.get('/logout', exports.User.logout);

	router.get('/users', exports.User.list);
	router.post('/users', exports.User.create);
	router.put('/users/:userId', exports.User.modify);
	router.get('/user', exports.User.currentUser);

	router.get('/division', exports.Division.list);
	router.post('/division', exports.Division.create);
	router.get('/division/:divisionId', exports.Division.detail);
	router.put('/division/:divisionId', exports.Division.modify);
	router.get('/division/:divisionId/export', exports.DanceExport.exportAll);

	router.get('/score_sheet', exports.ScoreSheet.list);
	router.post('/score_sheet', exports.ScoreSheet.create);
	router.get('/score_sheet/:scoreSheetId', exports.ScoreSheet.detail);
	router.put('/score_sheet/:scoreSheetId', exports.ScoreSheet.modify);

	router.get('/team', exports.Team.list);
	router.post('/team', exports.Team.create);
	router.get('/team/:teamId', exports.Team.detail);
	router.put('/team/:teamId', exports.Team.modify);

	router.get('/ladders', exports.Ladder.ladders);

	router.get('/score', exports.SubmittedScore.list);
	router.post('/score', exports.SubmittedScore.create);
	router.get('/score/:submittedScoreId', exports.SubmittedScore.detail);
	router.put('/score/:submittedScoreId', exports.SubmittedScore.modify);
}