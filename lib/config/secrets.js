module.exports = {
  dropbox: {
    clientId: process.env.DROPBOX_ID || 'ctb5km15b6s9bxz',
    clientSecret: process.env.DROPBOX_SECRET || 'a0ein8l46b8nkm1',
    redirectUrl: process.env.DROPBOX_REDIRECT_URL || 'http://localhost:9000/auth/dropbox/callback'
  }
};
