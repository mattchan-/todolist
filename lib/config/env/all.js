'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  ip: '0.0.0.0',
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  dropbox: {
    clientId: process.env.DROPBOX_ID || '09yecipc5x226ry',
    clientSecret: process.env.DROPBOX_SECRET || 'zlzira7yim5cf2i',
  }
};