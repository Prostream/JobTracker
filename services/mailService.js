const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

function getAuthenticatedClient(accessToken) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
  return client;
}

/**
 * 获取用户的邮件列表（只获取基础信息）
 * @param {string} accessToken 微软Graph API的access token
 * @returns {Promise<Array>} 邮件列表
 */
async function fetchEmails(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const messages = await client
    .api('/me/mailfolders/inbox/messages')
    .top(10)
    .select('id,subject,from,receivedDateTime')
    .orderby('receivedDateTime DESC')
    .get();
  return messages.value;
}

module.exports = {
  fetchEmails,
}; 