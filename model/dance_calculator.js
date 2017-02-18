"use strict"
const Promise = require('bluebird');
const r = require('./thinky').r;
var Team = require('./team');
var Division = require('./division');
var SubmittedScore = require('./submitted_score');

function averageScore(documents){
	var total = 0.0;
    for ( var i = 0; i < documents.length; i++ ){
      total += documents[i].total;
    }
    if ( documents.length == 0 ){
      return 0.0;
    }else{
      return (total / documents.length);
    }
}

function scoresByRound(documents){
  var roundTotals = {};
	for ( var i = 0; i < documents.length; i++ ){
    var doc = documents[i];
    var roundId = null;
    if ( roundTotals[doc.roundObj.id] == null ){
      roundTotals[doc.roundObj.id] = {
        documents: [], 
        total: 0.0,
        performanceCount: 0
      };
    }

    var roundTotal = roundTotals[doc.roundObj.id];
    roundTotal.documents.push(doc);
    roundTotal.total += doc.total;
    roundTotal.performanceCount += 1;
  }

  var roundIds = Object.keys(roundTotals);
  for ( var i = 0; i < roundIds.length; i++ ){
    var roundId = roundIds[i];
    var roundSet = roundTotals[roundId];
    if ( roundSet.documents.length > 0 ){
      roundSet.average = roundSet.total/roundSet.documents.length;
    }else{
      roundSet.average = 0.0;
    }
  }
  return roundTotals;
}

function highestRound(roundTotals){
  var highestScore = 0.0;
  var highestRound = null;
  var roundKeys = Object.keys(roundTotals);
  for ( var i = 0; i < roundKeys.length; i++ ){
    var round = roundTotals[roundKeys[i]];
    if ( highestScore < round.average ){
      highestScore = round.average;
      highestRound = roundKeys[i];
    }
  }
  return roundTotals[highestRound];
}

/*
  assumes that the objects of teams have had their interviews and
  performances populated - the rounds of the performances need to be populated as well
*/

exports.calculateTeamScore = function(team){
  var teamScore = {};
  teamScore.interviewScore = averageScore(team.interviews);
  teamScore.interviewCount = team.interviews.length;
  var nonFinals = [];
  var finals = [];

  for ( var i = 0; i < team.performances.length; i++ ){
    var performance = team.performances[i];
    if ( performance['roundObj'].isFinal ){
      finals.push(performance);
    }else{
      nonFinals.push(performance);
    }
  }

  teamScore.rounds = scoresByRound(nonFinals);

  var bestRound = highestRound(teamScore.rounds);
  if ( bestRound != null ){
    teamScore.performanceScore = bestRound.average;
  }else{
    teamScore.performanceScore = 0.0;
  }
  if ( finals.length > 0 ){
    teamScore.finals = scoresByRound(finals);
    var bestFinal = highestRound(teamScore.finals);
    teamScore.finalScore = bestFinal.average;
  }
  if ( teamScore.finalScore != null ){
    teamScore.overallFinalScore = teamScore.finalScore + teamScore.interviewScore;
  }else{
    teamScore.overallFinalScore = 0.0;
  }

  teamScore.overallScore = teamScore.performanceScore + teamScore.interviewScore;
  teamScore.team = team;

  return teamScore;
}

exports.calculateLadder = function(teams){
  var ladder = [];
  for ( var i = 0; i < teams.length; i++ ){
    var team = teams[i];
    ladder.push(exports.calculateTeamScore(team));
  }
  ladder.sort(function(a, b){
    if ( a.overallFinalScore < b.overallFinalScore ){
      return 1;
    }else if ( a.overallFinalScore > b.overallFinalScore ){
      return -1;
    }
    if ( a.overallScore < b.overallScore ){
      return 1;
    }else if ( a.overallScore > b.overallScore ){
      return -1;
    }
    return 0;
  });
  return ladder;
}

exports.calculateLadderForDivision = function(divisionId){
  return Division.get(divisionId)
  .then((division) => {

    return Team
    .filter(r.row("division").eq(division.id))
    .getJoin({"divisionObj": true})
    .run()
    .then((teams) => {
      return [division, teams];
    })
  }).spread((division, teams) => {
    let teamMap = {};
    let teamIds = [];
    for ( let i = 0; i < teams.length; i++ ){
      let team = teams[i];
      if ( teamMap[team.division] == null ){
        teamMap[team.division] = [];
      }
      teamMap[team.division].push(team);
      teamIds.push(team.id);
    }
    let teamCollection = teams;
    return SubmittedScore
    .getAll(r.args(teamIds), {index:"team"})
    .getJoin({"teamObj": true})
    .run()
    .then((submittedScores) => {
      return [division, teams, submittedScores, teamMap, teamCollection];
    });
  }).spread((division, teams, scores, teamMap, teamCollection) => {
    let divisionCollection = [division.toJson()];
    let roundMap = {}
    for (let i = 0; i < division.rounds.length; i++) {
      roundMap[division.rounds[i].id] = division.rounds[i];
    }
    let interviews = [];
    let performances = [];
    for ( let i = 0; i < scores.length; i++ ){
      if ( scores[i].scoreType == 1 ){
        interviews.push(scores[i]);
      }else{
        performances.push(scores[i]);
      }
    }
    for (let i = 0; i < teamCollection.length; i++){
      let team = teamCollection[i];
      team['interviews'] = [];
      team['performances'] = [];
      for ( var j = 0; j < interviews.length; j++ ){
        let interview = interviews[j];
        if ( interview.team == team.id ){
          team.interviews.push(interview);
        }
      }
      for ( var j = 0; j < performances.length; j++ ){
        let performance = performances[j];
        if ( performance.team == team.id ){
          performance['roundObj'] = roundMap[performance.round];
          team.performances.push(performance);
        }
      }
    }
    let divisionKeys = Object.keys(teamMap);
    let ladderDivisions = [];
    for ( var i = 0; i < divisionKeys.length; i++ ){
      let teams = teamMap[divisionKeys[i]];
      let ladder = exports.calculateLadder(teams);
      let divisionPayload = null;
      for ( let j = 0; j < divisionCollection.length; j++ ){
        if ( divisionCollection[j].id == divisionKeys[i]){
          divisionPayload = divisionCollection[j];
          break;
        }
      }
      divisionPayload.ladder = ladder;
      ladderDivisions.push(divisionPayload);
    }
    return ladderDivisions;
  })
}
