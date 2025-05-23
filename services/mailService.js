const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

function getAuthenticatedClient(accessToken) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
      //done(null, 'EwBIBMl6BAAUBKgm8k1UswUNwklmy2v7U/S+1fEAAcurb2qUqZjaawjJOQk2UuZX7IMDDOJF3YQc+ss0UTwsv/QomjN7ZX9src7G2gwSA0aoOO/sgPOXg+8IGy4+TxeM3rvYVBAwhGuDh1povZZmCmIOyFk/acoVFx/1xXORU5+lONWnu/bNwWD1phYlcPqg9AAXAYCGcH/SkMrJfc0ftzphmT7RF2/K8fWNlaE7Gx2SzKx80HHImX09pfzeODCDU0tz94fA+bH4iU1XdkVk/dXZDmFd2iTSFSymuYM3md2rHQU1tJIeERz/ip4pQlogP+lNnbK0w9wDQSESZjxTqm+uSeZEByXqsFt3B+eoBTk+u3Yo3+Q0iWQO69/tby4QZgAAEBa+3/mk3fZq41stTFxzApQQA7hOCYgqKfpFeYGyiCGjgFGeRB4F0I/MwBLoHgFNy4ZIK3owoXfs0wPNdj47/n0hRDBjH4Zl0ZVlHMXVbWFMdtVhGVHWWkvdFJWkyTaHjMR7fWX8wHyfotGJ/ZxKOb5socG/EzKe/NfTYqXdikvoPaPNgdX9e28foXYOjvvFnyDh5m0H7xoNcTCSByBwAvegevRmw/QKTEP2gxg/QtJGRl7GysRsyAmLBH22tfsglZm0Lg3uJ8jGl/rofdBWIIp/K5gGBUqqQZuIPZQeaNcGT9wcbSVbPHc1mkBSKooI85s6HJ5LNQrQAEHNeFXuE27mc/lA0uYMJi2zbfbEirLHr/BiZJTC7qx7kRJcYONK6R2FT4bbojzUudvIYQTh2TXTOczF5WoNejta92kZv7zngRI9YiJFGeaA5NtF2kqXRlWi0HF0z5C7BVl1PRnz6fzvlTvP3PBfLh0ejsfCJyEw0Yha9QvWPX1Jg0AwYtZBq5/JTgVKw29iz/fLuZ1X1CBakQ26L+aXKHa5n8Ureq2dAZoKlV4diEM60zVJ5rXrDQcOLoh8/hiZJ9/BJeaj9Dq+irlEkXAZXopWT/fHvPEgBJ1az9S1KPUpBBgaUaq8BLtKNZyBdNNkSAjJFZdo70o0eFsJKipMmIiP/Lcq+X8WoXe0iuSb+haHRTc1vZtepbDw/kYUEXMT5S5UARaRfatR4Kpi73xLCKjWIXlkZZCd0YiQAra6laHKX5ZhOae/HzAUr5bkZECKo+Hsl0p1s0RO6IswE4ZBxMiqk3l9z6vuCeHy28Wp1Ays+Du7KUhwnRLoLqpkHgeX1gCvC4HIrlnwTDL6lCzSHtvJbAQ4kn1nvRFgxLlq2bkoA6k5BADvi0AJD9HQ3x5hc4K+YNTzBq4qnj4V4Gz7weeSKMbtO1fj9nEYcLTiLGgqoGjrafWcUwNWrHXgTkxvodkejJ6nX6pDQwfO6Zmirz7RyosYLzkjpqruCQJrj4Sk+rgF3gO38Vr2J4eBxEtb01IWaqhPP3VVFezHCwr2v8bMcMl0C95YC0tPAw==');
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
  try {
    const messages = await client
      .api('/me/messages') 
      .top(10)
      .select('id,subject,from,receivedDateTime')
      .orderby('receivedDateTime DESC')
      .get();
    return messages.value;
  } catch (err) {
    console.error('🚨 获取邮件失败:', err);
    if (err?.body?.getReader) {
      try {
        const reader = err.body.getReader();
        const { value } = await reader.read();
        const decoded = new TextDecoder('utf-8').decode(value);
        console.error('🧾 Graph API 错误内容:', decoded);
      } catch (decodeErr) {
        console.error('❌ 无法解码 Graph API 错误内容:', decodeErr);
      }
    }
    throw err; // 继续抛出错误给上层处理
  }
}

module.exports = {
  fetchEmails,
};
