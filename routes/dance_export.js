"use strict"
const Promise = require('bluebird');
const promisify = require('bluebird-events');
const model = require('../model');
const path = require('path');
const officegen = require('officegen');
const fs = require('fs');
const targz = require('tar.gz');
const temp = Promise.promisifyAll(require('temp'));
const r = model.r;


function generateInterviewSheetForTeam(team, workbook){
	var interviewSheet = workbook.makeNewSheet();
	interviewSheet.name = 'Interviews';

	var rowCount = 3;

	if ( team.interviews.length == 0 ){
		return;
	}
	var firstInterview = team.interviews[0];
	for ( var i = 0; i < firstInterview.sections.length; i++ ){
		rowCount += 1 + firstInterview.sections[i].scores.length;
	}

	var colCount = 2; //+ team.interviews.length;

	var interviewArray = Array(rowCount);
	for ( var i = 0; i < rowCount; i++ ){
		interviewArray[i] = Array(colCount);
	}

	interviewArray[0][0] = "Criteria";
	interviewArray[0][1] = "Average";

	var currentRow = 1;

	for ( var i = 0; i < firstInterview.sections.length; i++ ){
		var section = firstInterview.sections[i];
		interviewArray[currentRow][0] = section.description;
		currentRow += 1;

		for ( var j = 0; j < section.scores.length; j++ ){
			var score = section.scores[j];
			interviewArray[currentRow][0] = score.description + ' (' + score.maxValue.toString() + ')';
			var total = 0.0;
			for ( var k = 0; k < team.interviews.length; k++ ){
				var interview = team.interviews[k];
				total += interview.sections[i].scores[j].recordedValue;
			}
			interviewArray[currentRow][1] = (total/team.interviews.length).toFixed(2);
			currentRow += 1;
		}
	}

	var totalComments = "";
	var totalScore = 0.0;
	interviewArray[currentRow][0] = "Comments"
	interviewArray[currentRow + 1][0] = "Total"
	for ( var i = 0; i < team.interviews.length; i++ ){
		var interview = team.interviews[i];
		if ( interview.comments != null ){
			totalComments += interview.comments + " ";
		}
		totalScore += interview.total;
	}
	interviewArray[currentRow][1] = totalComments;
	interviewArray[currentRow + 1][1] = (totalScore/team.interviews.length).toFixed(2);
	interviewSheet.data = interviewArray;
	return workbook;
}

function generatePerformanceSheetWithPerformancesForTeamInRound(performances, team, round, workbook){
	var performanceSheet = workbook.makeNewSheet();
	if ( round.isFinal ){
		performanceSheet.name = 'Final ' + round.order.toString();
	}else{
		performanceSheet.name = 'Round ' + round.order.toString();
	}
	var rowCount = 3; //top heading + comments + total

	if ( performances.length == 0 ){
		return;
	}
	var firstPerformance = performances[0];
	for ( var i = 0; i < firstPerformance.sections.length; i++ ){
		rowCount += 1 + firstPerformance.sections[i].scores.length;
	}

	var performanceArray = Array(rowCount);
	var colCount = 2;
	for ( var i = 0; i < rowCount; i++ ){
		performanceArray[i] = Array(colCount);
	}
	performanceArray[0][0] = "Criteria";
	performanceArray[0][1] = "Average";

	var currentRow = 1;

	for ( var i = 0; i < firstPerformance.sections.length; i++ ){
		var section = firstPerformance.sections[i];
		performanceArray[currentRow][0] = section.description;
		currentRow += 1;
		for ( var j = 0; j < section.scores.length; j++ ){
			var score = section.scores[j];
			performanceArray[currentRow][0] = score.description + ' (' + score.maxValue.toString() + ')';
			var total = 0.0;
			for ( var k = 0; k < performances.length; k++ ){
				var performance = performances[k];
				total += performance.sections[i].scores[j].recordedValue;
			}
			performanceArray[currentRow][1] = (total/performances.length).toFixed(2);
			currentRow += 1;
		}
	}

	var totalComments = "";
	var totalScore = 0.0;
	performanceArray[currentRow][0] = "Comments"
	performanceArray[currentRow + 1][0] = "Total"
	for ( var i = 0; i < performances.length; i++ ){
		var performance = performances[i];
		if ( performance.comments != null ){
			totalComments += performance.comments + " ";
		}
		totalScore += performance.total;
	}
	performanceArray[currentRow][1] = totalComments;
	performanceArray[currentRow + 1][1] = (totalScore/performances.length).toFixed(2);
	performanceSheet.data = performanceArray;

	return workbook;
}

function generatePerformanceSheetForTeamInRound(team, round, workbook){
	var allPerformances = team.performances;
	var matchingPerformances = [];
	for ( var i = 0; i < allPerformances.length; i++ ){
		var performance = allPerformances[i];
		if ( performance.round == round.id ){
			matchingPerformances.push(performance);
		}
	}
	if ( matchingPerformances.length > 0 ){
		return generatePerformanceSheetWithPerformancesForTeamInRound(matchingPerformances, team, round, workbook);
	}else{
		return workbook;
	}
}

var danceResults = null;
var danceTheatreResults = null;

function roundMatch(team, round){
	var rounds = null;
	if ( !round.isFinal ){
		rounds = team.normalRounds;
	}else{
		rounds = team.finalRounds;
	}
	for ( var i = 0; i < rounds.length; i++ ){
		if ( rounds[i].id == round.id ){
			return rounds[i];
		}
	}
	return null;
}

function generateLadderSheetForDivision(division, workbook){
	let ladderSheet = workbook.makeNewSheet();
	ladderSheet.name = 'Rankings';
	let divisionResults = division.ladder;

	let rowCount = 1 + divisionResults.ladder.length;
	let colCount = 3;

	let ladderArray = Array(rowCount);

	for ( let i = 0; i < rowCount; i++ ){
		ladderArray[i] = Array(colCount);
	}

	ladderArray[0][0] = 'Team Name (School Name)';
	ladderArray[0][1] = 'Score After Rounds';
	ladderArray[0][2] = 'Score After Finals';
	for ( let i = 0; i < divisionResults.ladder.length; i++ ){
		let ladderEntry = divisionResults.ladder[i];
		let team = ladderEntry.team;
		ladderArray[i + 1][0] = team.name + ' (' + team.school + ')';
		ladderArray[i + 1][1] = ladderEntry.overallScore;
		ladderArray[i + 1][2] = ladderEntry.overallFinalScore;
	}
	ladderSheet.data = ladderArray;
	return workbook;
}

function generateSheetForTeams(team, division, tempPath) {
	return Promise.try(() => {
		let xlsx = officegen ( 'xlsx' );
		generateLadderSheetForDivision(division, xlsx);
		generateInterviewSheetForTeam(team, xlsx);
		for ( let i = 0; i < division.rounds.length; i++ ){
			generatePerformanceSheetForTeamInRound(team, division.rounds[i], xlsx);
		}
		let fileName = team.name + '.xlsx';
		let finalPath = path.join(tempPath, fileName);
		let out = fs.createWriteStream ( finalPath );
		let promiseObj = promisify(out, {
			resolve: 'close'
		})
		xlsx.generate ( out );
		return promiseObj.then(() => {
			return [finalPath, fileName, team]
		});
	}).spread((finalPath, fileName, team) => {
		return {
			path: finalPath, 
			fileName: fileName, 
			teamName: team.name, 
			teamSchool: team.school
		}
	})
}

exports.exportAll = function(req, res){
	return Promise.try(() => {
		return Promise.all([
			model.Division.get(req.params.divisionId),
			model.Team.filter(r.row("division").eq(req.params.divisionId)),
			model.DanceCalculator.calculateLadderForDivision(req.params.divisionId),
			temp.mkdirAsync('roboexports')
		])
	}).spread((division, teams, ladder, tempDir) => {
		let teamIds = [];
		for ( let i = 0; i < teams.length; i++ ){
			teamIds.push(teams[i].id);
		}
		return model.SubmittedScore
	    .getAll(r.args(teamIds), {index:"team"})
	    .run()
	    .then((submittedScores) => {
	    	return [division, teams, ladder, tempDir, submittedScores]
	    });
	}).spread((division, teams, ladder, tempDir, scores) => {
		let interviews = [];
		let performances = [];
		for ( let i = 0; i < scores.length; i++ ){
			if ( scores[i].scoreType == 1 ){
				interviews.push(scores[i]);
			}else{
				performances.push(scores[i]);
			}
		}
		for ( let i = 0; i < ladder.length; i++ ){
			if ( ladder[i].id == division.id ){
				division.ladder = ladder[i];
				break;
			}
		}
		for ( let i = 0; i < teams.length; i++ ){
			let team = teams[i];
			team.interviews = [];
			team.performances = [];
			for ( let j = 0; j < interviews.length; j++ ){
				let interview = interviews[j];
				if ( interview.team == team.id ){
					team.interviews.push(interview);
				}
			}
			for ( let j = 0; j < performances.length; j++ ){
				let performance = performances[j];
				if ( performance.team == team.id ){
					team.performances.push(performance);
				}
			}
		}
		let promises = teams.map((team) => {
			return generateSheetForTeams(team, division, tempDir);
		})
		return Promise.all(promises).then((filePaths) => {
			return [filePaths, tempDir, division];
		});
	}).spread((filePaths, dirPath, division) => {
		let zipPath = path.join('/tmp', division.name + division.category + '.tar.gz');
		return targz({},{
			fromBase: true
		})
		.compress(dirPath + '/', zipPath)
		.then(() => {
			return zipPath;
		})
	}).then((zipPath) => {
		return res.download(zipPath);
	}).catch((err) => {
		console.log(err);
		res.sendStatus(500);
		return res.end();
	})
}
