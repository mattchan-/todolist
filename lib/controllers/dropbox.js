/* global io */
'use strict';

var _ = require('underscore'),
    Dropbox = require('dropbox'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    socketManager = require('../socketManager'),
    CryptoJS = require('crypto-js'),
    secrets = require('../config/secrets');

var TODO_FILE = 'todo_list.txt';

var dropbox = {
  getDropbox : function(req, res) {
    var token = _.findWhere(req.user.tokens, { kind: 'dropbox' });
    var dropbox = new Dropbox.Client({ token: token.accessToken });
    dropbox.readdir("/", function(error, dir, base, details) {
      if (error) {
        return res.send(400, error);
      }
      res.send(details);
    });
  },
  updateFile : function(req, res) {
    var token = _.findWhere(req.user.tokens, { kind: 'dropbox' });
    var dropbox = new Dropbox.Client({ token: token.accessToken });
    dropbox.writeFile(TODO_FILE, req.body.tasks, function(error, stat) {
      if (error) {
        return res.send(400, error);
      }
      res.send(stat);
    });
  },
  webhook : function(req, res) {
    return res.send(req.query.challenge);
  },
  webhookData : function(req, res) {
    var webhookUserCallback = function(err, user) { // called after finding the user
      if (err) {
        return res.send(404, err);
      }
      var readFileCallback = function(err, file, stat) { //called after finding the todo_list.txt file
        if (err) {
          return res.send(404, err);
        }
        var tasks;

        tasks = JSON.parse(file);
        console.log(tasks);
        socketManager.io.sockets.emit('webhook', tasks);
      };
      var token,
          dropbox;

      token = _.findWhere(user.tokens, { kind: 'dropbox' });
      dropbox = new Dropbox.Client({ token: token.accessToken });
      dropbox.delta(token.cursor, function(err, data) {
        // if (err) {

        // }
        token.cursor = data.cursor();
        user.markModified('tokens');
        user.save(function(err) {
          if (err) {
            return res.send(404, err);
          }
          // cursor saved
        });
        for (var i = 0; i < data.changes.length; i++) {
          if (data.changes[i].stat && data.changes[i].stat.name === TODO_FILE) {
            dropbox.readFile(data.changes[i].stat.path, readFileCallback);
          }
        }
      });
    };
    // var signature;
    // signature = req.headers['x-dropbox-signature'];
    // console.log(CryptoJS.HmacSHA256(req.body.toString(), secrets.dropbox.clientSecret), req.headers['x-dropbox-signature']);
    for (var i = 0; i < req.body.delta.users.length; i++) {
      var dropbox,
          uid;

      uid = req.body.delta.users[i];
      User.findOne({'tokens.uid': uid}, webhookUserCallback);
      // console.log(dropbox.delta(cursor));
    }
    return res.json(req.body);
  },
  accountInfo : function(req, res) {
    var token = _.findWhere(req.user.tokens, { kind: 'dropbox' });
    var dropbox = new Dropbox.Client({ token: token.accessToken });
    dropbox.getAccountInfo(function(err, accountInfo, data) {
      console.log('data', data);
    });
    return res.send("hi");
  }
};
module.exports = dropbox;