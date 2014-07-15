'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
         'mongodb://localhost/fullstack'
  },
  dropbox: {
    clientId: process.env.DROPBOX_ID || 'ctb5km15b6s9bxz',
    clientSecret: process.env.DROPBOX_SECRET || 'a0ein8l46b8nkm1',
    redirectUrl: process.env.DROPBOX_REDIRECT_URL || 'http://my-new-app.herokuapp.com/auth/dropbox/callback'
  }
};