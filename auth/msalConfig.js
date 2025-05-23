const msal = require('@azure/msal-node');

const msalConfig = {
  auth: {
    clientId: process.env.MS_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    //authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
    //clientSecret: process.env.MS_CLIENT_SECRET,
  },
};

const REDIRECT_URI = process.env.MS_REDIRECT_URI || 'http://localhost:3000/auth/callback';

const SCOPES = [
  'Mail.Read',
  'User.Read',
  'offline_access'
];


module.exports = {
  msalConfig,
  REDIRECT_URI,
  SCOPES,
}; 