'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  },
  dropbox: {
    redirectUrl: process.env.DROPBOX_REDIRECT_URL || 'http://localhost:9000/auth/dropbox/callback'
  }
};