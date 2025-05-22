require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('JobTracker 邮件追踪服务已启动');
});

// 预留：Outlook 邮件读取API
// app.get('/api/emails', ...)

app.listen(PORT, () => {
  console.log(`服务器已启动，端口：${PORT}`);
}); 