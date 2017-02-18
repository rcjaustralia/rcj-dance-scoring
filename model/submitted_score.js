"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;
const SubmittedScore = thinky.createModel("SubmittedScore", {
  id: type.string().uuid(4).default(uuid.v4),
  team: type.string().uuid(4).required(),
  user: type.string().uuid(4).required(),
  division: type.string().uuid(4).required(),
  round: type.string(),
  scoreType: type.number().required(),
  comments: type.string(),
  total: type.number().default(0.0),
  sections: type.array().schema({
    id: type.string().uuid(4).default(uuid.v4),
    description: type.string().required(),
    scores: type.array().schema({
      id: type.string().uuid(4).default(uuid.v4),
      description: type.string().required(),
      guide: type.string(),
      maxValue: type.number().required(),
      recordedValue: type.number().required()
    }),
    total: type.number().default(0.0)
  }).default([]),
  timings: type.array().schema({
    name: type.string().required(),
    value: type.string()
  }).default([])
});

SubmittedScore.define('updateTotals', function() {
  let completeTotal = 0.0;
  for (let i = 0; i < this.sections.length; i++) {
    let section = this.sections[i];
    let sectionTotal = 0.0;
    for (let j = 0; j < section.scores.length; j++) {
      let score = section.scores[j];
      sectionTotal += parseFloat(score.recordedValue);
    }
    section.total = sectionTotal;
    completeTotal += parseFloat(section.total);
  }
  this.total = completeTotal;
})

SubmittedScore.define('toJson', function() {
  let hash = {
    id: this.id,
    scoreType: this.scoreType,
    sections:[],
    timings:[],
    createdAt: this.createdAt,
    comments: this.comments,
    total: this.total
  }
  if ((this.round !== null) && (this.round !== undefined)) {
    hash.round = this.round;
  }
  let objects = ['team', 'user', 'division'];
  for ( let i = 0; i < objects.length; i++ ){
    let key = objects[i];
    let objKey = `${key}Obj`;
    if (this[objKey]) {
      hash[key] = this[objKey];
    } else {
      hash[key] = this[key];
    }
  }
  for (let i = 0; i < this.sections.length; i++ ) {
    let section = this.sections[i];
    let sectionHash = {
      id: section.id,
      description: section.description,
      scores:[],
      total: section.total
    }
    for (let j = 0; j < section.scores.length; j++) {
      let score = section.scores[j]; 
      let scoreHash = {
        id: score.id,
        description: score.description,
        maxValue: score.maxValue,
        recordedValue: score.recordedValue
      }
      if (score.guide) {
        scoreHash.guide = score.guide;
      }
      sectionHash.scores.push(scoreHash);
    }
    hash.sections.push(sectionHash);
  }
  return hash;
})

SubmittedScore.ensureIndex("team");

module.exports = SubmittedScore;
