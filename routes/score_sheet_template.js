"use strict"
const Promise = require('bluebird');
var model = require('../model');

exports.list = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.ScoreSheetTemplate.run();
  }).then((templates) => {
    var results = [];
    for ( var i = 0; i < templates.length; i++ ){
      results.push(templates[i].toJson());
    }
    res.send(JSON.stringify(results));
    return res.end();
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
    return res.end();
  })
}

function populateScoreSheetTemplate(modelObject, payload){
  modelObject.description = payload.description;
  modelObject.enabled = payload.enabled;
  modelObject.sections.splice(0, modelObject.sections.length);
  for ( var i = 0; i < payload.sections.length; i++ ){
    var sectionPayload = payload.sections[i];
    modelObject.sections.push({
      description: sectionPayload.description,
      criteria: []
    });
    var sectionModel = modelObject.sections[modelObject.sections.length - 1];
    for ( var j = 0; j < sectionPayload.criteria.length; j++ ){
      var criteriaPayload = sectionPayload.criteria[j];
      sectionModel.criteria.push({
        description: criteriaPayload.description,
        maxValue: criteriaPayload.maxValue
      });
      var criteriaModel = sectionModel.criteria[sectionModel.criteria.length - 1];
      if ( criteriaPayload.guide ){
        criteriaModel.guide = criteriaPayload.guide;
      }
    }
  }
  modelObject.timings.splice(0, modelObject.timings.length);
  for ( var i = 0; i < payload.timings.length; i++ ){
    modelObject.timings.push(payload.timings[i]);
  }
}

exports.create = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    let scoreSheet = new model.ScoreSheetTemplate({});
    populateScoreSheetTemplate(scoreSheet, req.body);
    return scoreSheet.save()
  }).then((savedScoreSheet) => {
    res.send(JSON.stringify(savedScoreSheet.toJson()));
    return res.end();
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
    return res.end();
  })
}

exports.detail = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.ScoreSheetTemplate.get(req.params.scoreSheetId)
  }).then((scoreSheet) => {
    res.send(JSON.stringify(scoreSheet.toJson()));
    return res.end();
  }).catch((err) => {
    res.sendStatus(500);
    return res.end();
  })
}

exports.modify = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.ScoreSheetTemplate.get(req.params.scoreSheetId)
  }).then((scoreSheet) => {
    populateScoreSheetTemplate(scoreSheet, req.body);
    return scoreSheet.save();
  }).then((savedScoreSheet) => {
    res.send(JSON.stringify(savedScoreSheet.toJson()));
    return res.end();
  }).catch((err) => {
    res.sendStatus(500);
    return res.end();
  })
}
