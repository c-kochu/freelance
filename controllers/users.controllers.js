'use strict';

require('../models/users.models');
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    jwt = require('jsonwebtoken');

exports.createUser = function(req, res, next) {
  if(!req.body.emailAddress || !req.body.password || !req.body.name) {
    return res.status(400).json({message: 'Please fill out all fields; name, emailAddress, password'});
  }
  User.findOne({emailAddress: req.body.emailAddress}, function(err, user){
    if (err){
      return next(err);
    }
      if (user) {
         return res.status(400).json({message: 'emailAddress already in our database, login instead'});
      }
      else {
        var newUser = new User();
        newUser.name = req.body.name;
        newUser.emailAddress = req.body.emailAddress;
        newUser.phoneNumber = req.body.phoneNumber;
        newUser.picture = req.body.picture;
        newUser.interests = req.body.interests;
        newUser.skill = req.body.skill;
        newUser.gender = req.body.gender;
        newUser.setPassword(req.body.password);
        newUser.save(function (err, user){
          if(err){
            return res.status(400).json(err);
          }
          return res.status(200).json({
            token: user.generateJWT(),
            user: user.name
          });
        });
      }
  });
};
exports.viewUsers = function(req, res) {
  User.find(function(err, users) {
    if(err){
      return res.status(400).json(err);
    }
    res.json(users);
  });
};
exports.viewOneUser = function(req, res) {
  User.findOne({
    _id: req.decoded._id
  }, function(err, user) {
    if(err){
      return res.status(400).json(err);
    }
    res.status(200).json(user);
  });
};
exports.updateUser = function(req, res) {
  User.findOne({
    _id: req.decoded._id
  },
  function(err, user) {
    if(err){
      return res.status(400).json(err);
    }
    user.name = req.body.name;
    user.phoneNumber = req.body.phoneNumber;
    user.interests = req.body.interests;
    user.skill = req.body.skill;
    user.gender = req.body.gender;
    user.setPassword(req.body.password);
    user.save(function (err, user){
      if(err){
        return res.status(400).json(err);
      }
      return res.status(200).json(user);
    });
  });
};
exports.deleteUsers = function(req, res) {
  User.remove(function(err, users) {
    if(err){
      return res.status(400).json(err);
    }
    res.status(200).json(users);
  });
};
exports.deleteOneUser = function(req, res) {
  User.remove({
    _id: req.decoded._id
  }, function(err, user) {
    if(err){
      return res.status(400).json(err);
    }
    res.status(200).json(user);
  });
};

exports.loginUser = function(req, res, next) {
  if(!req.body.emailAddress || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields; emailAddress and password'});
  }
  User.findOne({
    emailAddress: req.body.emailAddress
  }, function(err, user){
    if(err){
      return res.status(400).json(err);
    }
    if(user){
      if(user.validPassword(req.body.password)){
        return res.status(200).json({
          token: user.generateJWT(),
          user: user.name
        });
      }
      else {
         return res.status(401).json({message: 'Enter a valid password'});
      }
    }
    else{
       return res.status(401).json({message: 'Email address not in our database'});
    }
  });
};
