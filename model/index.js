/*var danceInterview = require('./dance_interview');
exports.DanceInterview = danceInterview;

var dancePerformance = require('./dance_performance');
exports.DancePerformance = dancePerformance;

var division = require('./division');
exports.Division = division;

var team = require('./team');
exports.Team = team;

var danceCalculator = require('./dance_calculator');
exports.DanceCalculator = danceCalculator;

var scoreSheetTemplate = require('./score_sheet_template');
exports.ScoreSheetTemplate = scoreSheetTemplate;

var submittedScore = require('./submitted_score');
exports.SubmittedScore = submittedScore;
*/

var user = require('./user');
exports.User = user;
var division = require('./division');
exports.Division = division;
var scoreSheetTemplate = require('./score_sheet_template');
exports.ScoreSheetTemplate = scoreSheetTemplate;
var team = require('./team');
division.hasMany(team, "teams", "id", "division");
team.belongsTo(division, "divisionObj", "division", "id");
exports.Team = team;
var submittedScore = require('./submitted_score');
submittedScore.belongsTo(team, "teamObj", "team", "id");
submittedScore.belongsTo(user, "userObj", "user", "id");
submittedScore.belongsTo(division, "divisionObj", "division", "id");
exports.SubmittedScore = submittedScore;

var danceCalculator = require('./dance_calculator');
exports.DanceCalculator = danceCalculator;

exports.thinky = require('./thinky');
exports.r = exports.thinky.r;