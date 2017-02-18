"use strict"
const thinky = require('./thinky');
const uuid = require('node-uuid');
const type = thinky.type;
const ScoreSheetTemplate = thinky.createModel("ScoreSheetTemplate", {
  id: type.string().uuid(4).default(uuid.v4),
  description: type.string().required(),
  sheetType: type.number().required().default(1),
  enabled: type.boolean().required().default(false),
  sections: type.array().schema({
    id: type.string().uuid(4).default(uuid.v4),
    description: type.string().required(),
    criteria: type.array().schema({
      id: type.string().uuid(4).default(uuid.v4),
      description: type.string().required(),
      guide: type.string().optional(),
      maxValue: type.number().required()
    }).default([])
  }).default([]),
  timings: type.array().schema(type.string()).default([])
});

ScoreSheetTemplate.define('toJson', function() {
  var hash = {
    id: this.id,
    description: this.description,
    sheetType: this.sheetType,
    enabled: this.enabled,
    sections:[],
    timings:this.timings
  }
  for ( var i = 0; i < this.sections.length; i++ ){
    let section = this.sections[i];
    let sectionHash = {
      id: section.id,
      description: section.description,
      criteria: []
    }
    for (var j = 0; j < section.criteria.length; j++) {
      let criteria = section.criteria[j];
      let criteriaHash = {
        id: criteria.id,
        description: criteria.description,
        maxValue: criteria.maxValue
      }
      if (criteria.guide) {
        criteriaHash.guide = criteria.guide;
      }
      sectionHash.criteria.push(criteriaHash)
    }
    hash.sections.push(sectionHash);
  }
  return hash;
})

module.exports = ScoreSheetTemplate;
