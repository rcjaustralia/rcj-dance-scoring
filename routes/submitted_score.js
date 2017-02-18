"use strict"
const Promise = require('bluebird');
const model = require('../model');
const r = model.thinky.r;
var util = require('util');

function populateSubmittedScore(modelObject, payload){
  console.log(payload);
  modelObject.team = payload.team;
  modelObject.user = payload.user;
  modelObject.scoreType = payload.scoreType;
  if ( modelObject.scoreType == 2){
    modelObject.round = payload.round;
  }
  modelObject.division = payload.division;
  modelObject.comments = payload.comments;
  modelObject.sections.splice(0, modelObject.sections.length);
  for ( var i = 0; i < payload.sections.length; i++ ){
    var payloadSection = payload.sections[i];
    modelObject.sections.push({
      description: payloadSection.description,
      scores: []
    });
    var modelSection = modelObject.sections[modelObject.sections.length - 1];
    for ( var j = 0; j < payloadSection.scores.length; j++ ){
      var payloadScore = payloadSection.scores[j];
      var obj = {
        description: payloadScore.description,
        maxValue: payloadScore.maxValue,
        recordedValue: payloadScore.recordedValue
      };
      if ( payloadScore.guide != null ){
        obj.guide = payloadScore.guide;
      }
      modelSection.scores.push(obj);
    }
  }
  modelObject.timings.splice(0, modelObject.timings.length);
  for ( var i = 0; i < payload.timings.length; i++ ){
    var payloadTiming = payload.timings[i];
    var obj = {
      name: payloadTiming.name
    };
    if ( payloadTiming.value != null ){
      obj.value = payloadTiming.value;
    }
    modelObject.timings.push(obj);
  }
  return modelObject;
}

exports.list = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    let query = model.SubmittedScore;
    if ( req.query.team != null ){
      query = query.filter(r.row("team").eq(req.query.team));
    }
    if ( req.query.user != null ){
      query = query.filter(r.row("user").eq(req.query.user));
    }
    if ( req.query.detailed == 'true' ){
      query = query.getJoin({
        "teamObj": true,
        "userObj": true,
        "divisionObj": true
      })
    }
    return query.run()
  }).then((scores) => {
    var results = [];
    for ( var i = 0; i < scores.length; i++ ){
      results.push(scores[i].toJson());
    }
    res.send(JSON.stringify(results));
    return res.end();
  }).catch((err) => {
    console.log(err);
    res.send(500);
    return res.end();
  })
}

exports.detail = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.SubmittedScore.get(req.params.submittedScoreId);
  }).then((score) => {
    res.send(JSON.stringify(score.toJson()));
    return res.end();
  }).catch((err) => {
    console.log(err);
    res.send(500);
    return res.end();
  })
}

exports.create = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    if (req.body.id) {
      return model.SubmittedScore.get(req.body.id)
      .catch((err) => {
        return new model.SubmittedScore({
          id: req.body.id
        });
      })
    }
    return new model.SubmittedScore();
  }).then((submittedScore) => { 
    req.body.user = req.currentUser.id;
    populateSubmittedScore(submittedScore, req.body);
    submittedScore.updateTotals();
    return submittedScore.save()
  }).then((savedScore) => {
    res.send(JSON.stringify(savedScore.toJson()));
    res.end();
  }).catch((err) => {
    console.log(err);
    res.send(500);
    return res.end();
  })
}

exports.modify = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.SubmittedScore.get(req.params.submittedScoreId);
  }).then((submittedScore) => {
    populateSubmittedScore(submittedScore, req.body);
    submittedScore.updateTotals();
    return submittedScore.save()
  }).then((savedScore) => {
    res.send(JSON.stringify(savedScore.toJson()));
    res.end();
  }).catch((err) => {
    console.log(err);
    res.send(500);
    return res.end();
  })
}
