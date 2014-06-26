'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Task Schema
 */
var TaskSchema = new Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now }
});

mongoose.model('Task', TaskSchema);
