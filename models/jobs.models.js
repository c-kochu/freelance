'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    slug = require('mongoose-url-slugs');

var jobSchema = new Schema({
  title: {
    type: String,
    required: 'title must be present'
  },
  description: {
    type: String
  },
  tools: {
    type: String
  },
  skill: {
    type: String
  },
  applicants: [
    {
      type: Schema.ObjectId,
      ref: 'Users'
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'Users'
  },
  comments: [{
    type:Schema.ObjectId,
    ref: 'Comments'
  }],
  tags: [{
    type:Schema.ObjectId,
    ref: 'Tags'
  }]
});
jobSchema.plugin(slug('title'));

jobSchema.methods.applyFor = function(author, cb){
  this.applicants.push(author);
  this.save(cb);
};

jobSchema.methods.postComment = function(comment, cb){
  this.comments.push(comment);
  this.save(cb);
};

mongoose.model('Jobs', jobSchema);
