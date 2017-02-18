"use strict"
const Promise = require('bluebird');
var model = require('../model');

exports.list = function(req, res){
	let r = model.thinky.r;
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		if ( req.query.category != null ){
			return model.Division
			.filter(r.row("category").eq(req.query.category)).run()
			.then((divisions) => {
				let ids = divisions.map((division) => {
					return division.id;
				})
				return model.Team
				.getAll(r.args(ids), {index:"division"})
				.getJoin({"divisionObj": true})
				.run()
			})
		}
		if ( req.query.division != null ) {
			return model.Team
			.filter(r.row("division").eq(req.query.division))
			.getJoin({"divisionObj": true})
			.run()
		}
		return model.Team.getJoin({"divisionObj": true}).run();
	}).then((teams) => {
		res.send(JSON.stringify(teams));
		return res.end();
	}).catch((err) => {
		console.log(err);
		res.send(500);
		return res.end();
	})
}

function populateTeam(modelObject, payload){
	console.log(payload);
	modelObject.name = payload.name;
	modelObject.school = payload.school;
	modelObject.division = payload.division;
	return modelObject;
}

exports.detail = function(req, res){
	return Promise.try(() => {
		res.setHeader('Content-Type', 'application/json');
		return model.Team
		.get(req.params.teamId)
		.getJoin({"divisionObj": true})
		.run()
	}).then((team) => {
		console.log("MEOIANSIJD", team.toJson());
		res.send(JSON.stringify(team.toJson()));
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
		let team = new model.Team({});
		populateTeam(team, req.body);
		return team.save();
	}).then((savedTeam) => {
		res.send(JSON.stringify(savedTeam.toJson()));
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
		return model.Team.get(req.params.teamId);
	}).then((team) => {
		populateTeam(team, req.body);
		return team.save();
	}).then((savedTeam) => {
		res.send(JSON.stringify(savedTeam.toJson()));
		return res.end();
	}).catch((err) => {
		console.log(err);
		res.send(500);
		return res.end();
	})
}
