require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { fetchEmails } = require('./services/mailService');
const msal = require('@azure/msal-node');
const { msalConfig, REDIRECT_URI, SCOPES } = require('./auth/msalConfig');

const cca = new msal.ConfidentialClientApplication(msalConfig);
let cachedToken = null;

app.get('/', (req, res) => {
  res.send('JobTracker 邮件追踪服务已启动');
});

app.get('/auth/login', (req, res) => {
  const authUrlParams = {
    scopes: SCOPES,
    redirectUri: REDIRECT_URI,
  };
  cca.getAuthCodeUrl(authUrlParams).then((response) => {
    res.redirect(response);
  }).catch((err) => res.status(500).send('获取授权URL失败: ' + err.message));
});

app.get('/auth/callback', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: SCOPES,
    redirectUri: REDIRECT_URI,
  };
  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    cachedToken = response;
    res.send('授权成功！现在可以访问 /api/emails 获取你的邮件。');
  } catch (err) {
    res.status(500).send('获取token失败: ' + err.message);
  }
});

app.get('/api/emails', async (req, res) => {
  let accessToken;
  if (cachedToken && cachedToken.accessToken) {
    accessToken = cachedToken.accessToken;
    // 检查token是否快过期，可加刷新逻辑
  } else {
    return res.status(401).json({ error: '请先访问 /auth/login 进行授权' });
  }
  try {
    const emails = await fetchEmails(accessToken);
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: '获取邮件失败', detail: err.message });
  }
});

// 预留：Outlook 邮件读取API
// app.get('/api/emails', ...)

app.listen(PORT, () => {
  console.log(`服务器已启动，端口：${PORT}`);
}); 