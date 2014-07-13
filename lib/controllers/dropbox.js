'use strict';

var _ = require('underscore'),
    Dropbox = require('dropbox'),
    client = require('redis').createClient();

var dropbox = {
  getDropbox : function(req, res) {
    var token = _.findWhere(req.user.tokens, { kind: 'dropbox' });
    var dropbox = new Dropbox.Client({ token: token.accessToken });
    dropbox.readdir("/", function(error, dir, base, details) {
      if (error) {
        res.send(400, error);
      }
      res.send(details);
    });
  },
  updateFile : function(req, res) {
    var token = _.findWhere(req.user.tokens, { kind: 'dropbox' });
    var dropbox = new Dropbox.Client({ token: token.accessToken });
    dropbox.writeFile("todo_list.txt", req.body.tasks, function(error, stat) {
      if (error) {
        res.send(400, error);
      }
      res.send(stat);
    });
  },
  webhook : function(req, res) {
    return res.send(req.query.challenge);
  },
  webhookData : function(req, res) {
    return res.json(req.body);
  }
};

module.exports = dropbox;