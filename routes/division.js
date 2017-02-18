"use strict"
const Promise = require('bluebird');
var model = require('../model');
const uuid = require('uuid');
exports.list = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		return model.Division.run()
	}).then((divisions) => {
		var results = [];
		for ( var i = 0; i < divisions.length; i++ ){
			results.push(divisions[i].toJson())
		}
		res.send(results);
		return res.end();
	}).catch((err) => {
		res.send(500);
		return res.end();
	})
}

function populateRound(modelObject, payload){
	modelObject.isFinal = payload.isFinal;
	modelObject.order = payload.order;
	return modelObject;
}

function populateDivision(modelObject, payload){
	console.log(payload);
	modelObject.category = payload.category;
	modelObject.name = payload.name;
	var touchedIds = [];
	for ( var i = 0; i < payload.rounds.length; i++ ){
		var round = payload.rounds[i];
		var roundObj = null;
		for (var j = 0; j < modelObject.rounds.length; j++) {
			if (modelObject.rounds[j].id === round.id) {
				roundObj = modelObject.rounds[j];
			}
		}
		if (roundObj === null) {
			modelObject.rounds.push({
				id: uuid.v4()
			});
			roundObj = modelObject.rounds[modelObject.rounds.length - 1];
		}
		populateRound(roundObj, round);
		touchedIds.push(roundObj.id);
	}
	modelObject.open = payload.open;
	modelObject.interviewSheetTemplate = payload.interviewSheetTemplate;
	modelObject.performanceSheetTemplate = payload.performanceSheetTemplate;
	var toBeRemoved = [];
	console.log(modelObject);
	for ( var i = 0; i < modelObject.rounds.length; i++ ){
		var round = modelObject.rounds[i];
		if ( touchedIds.indexOf(round.id) == -1 ){
			toBeRemoved.push(round);
		}
	}
	for ( var i = 0; i < toBeRemoved.length; i++ ){
		modelObject.rounds.id(toBeRemoved[i].id).remove();
	}
	return modelObject;
}

exports.create = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		var division = new model.Division({});
		division = populateDivision(division, req.body);
		return division.save()
	}).then((savedDivision) => {
		res.send(JSON.stringify(savedDivision.toJson()));
		return res.end();
	}).catch((err) => {
		console.log(err);
		res.send(500);
		return res.end();
	})
}

exports.modify = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		return model.Division.get(req.params.divisionId)
	}).then((division) => {
		populateDivision(division, req.body)
		return division.save();
	}).then((savedDivision) => {
		res.send(JSON.stringify(savedDivision.toJson()));
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
		return model.Division.get(req.params.divisionId)
	}).then((division) => {
		res.send(JSON.stringify(division.toJson()));
		return res.end();
	}).catch((err) => {
		console.log(err);
		res.send(500);
		return res.end();
	})
}
