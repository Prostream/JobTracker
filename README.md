# JobTracker

JobTracker 是一个基于 Node.js 的应用，通过读取 Outlook 邮箱中的求职相关邮件，帮助用户追踪找工作进展。

## 功能规划
- 通过 Microsoft Graph API 读取 Outlook 邮箱邮件
- 自动筛选与求职相关的邮件
- 提供邮件追踪和统计接口

## 快速开始
1. 安装依赖：
   ```bash
   npm install
   ```
2. 配置环境变量（.env 文件）：
   - PORT
   - MICROSOFT_CLIENT_ID
   - MICROSOFT_CLIENT_SECRET
   - MICROSOFT_TENANT_ID
   - MICROSOFT_REFRESH_TOKEN
3. 启动服务：
   ```bash
   npm start
   ```

## 后续开发
- 集成 Microsoft Graph API
- 邮件筛选与标签
- 前端展示（可选） 