"use strict"
const Promise = require('bluebird');
const model = require('../model');
const r = model.thinky.r;

exports.ladders = function(req, res){
  return Promise.try(() => {
    res.setHeader('Content-Type', 'application/json');
    return model.Division.filter(r.row("open").eq(true)).run()
  }).then((divisions) => {
    let promises = divisions.map((division) => {
      return model.DanceCalculator.calculateLadderForDivision(division.id)
    })
    return Promise.all(promises);
  }).then((ladders) => {
    let allLadders = [];
    ladders.forEach((ladderItem) => {
      ladderItem.forEach((ladder) => {
        allLadders.push(ladder);
      })
    })
    res.send(JSON.stringify(allLadders));
    return res.end()
  }).catch((err) => {
    console.log(err);
    res.send(500);
    return res.end();
  })
}
