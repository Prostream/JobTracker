require('dotenv').config();
const express = require('express');
const msal = require('@azure/msal-node');
const { msalConfig, REDIRECT_URI, SCOPES } = require('./auth/msalConfig');

const app = express();
const PORT = process.env.PORT || 3000;

const { PublicClientApplication } = require('@azure/msal-node');
const cca = new PublicClientApplication(msalConfig);

let cachedToken = null;

app.get('/', (_, res) => {
  res.send('✅ 服务启动成功，访问 /auth/login');
});

app.get('/auth/login', async (_, res) => {
  const authUrl = await cca.getAuthCodeUrl({
    scopes: SCOPES,
    redirectUri: REDIRECT_URI,
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  if (!req.query.code) return res.status(400).send('❗ 缺少 code 参数');

  try {
    const response = await cca.acquireTokenByCode({
      code: req.query.code,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
    });

    cachedToken = response;
    console.log('✅ Access Token:', cachedToken.accessToken.slice(0, 20) + '...');
    res.send('🎉 授权成功！现在访问 /api/emails');
  } catch (err) {
    console.error('❌ 获取 token 失败:', err);
    res.status(500).send('获取token失败: ' + err.message);
  }
});

app.get('/api/emails', async (_, res) => {
  if (!cachedToken) return res.status(401).send('请先登录');

  // 你可以在此处接入 Graph API 的 fetchEmails 方法
  res.send('✅ 已获取 token，可调用 Graph API');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
