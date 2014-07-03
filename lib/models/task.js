'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Task Schema
 */
var TaskSchema = new Schema({
  description: { type: String, required: 'Task cannot be blank' },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  created_at: { type: Date },
  updated_at: { type: Date }
});

TaskSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

mongoose.model('Task', TaskSchema);