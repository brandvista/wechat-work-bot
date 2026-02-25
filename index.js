const axios = require('axios');
const cron = require('node-cron');

const CORP_ID = process.env.CORP_ID;
const AGENT_ID = process.env.AGENT_ID;
const SECRET = process.env.SECRET;

async function getAccessToken() {
  const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${SECRET}`;
  const res = await axios.get(url);
  return res.data.access_token;
}

async function sendMessage() {
  try {
    const token = await getAccessToken();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;
    
    const data = {
      touser: '@all',
      msgtype: 'text',
      agentid: AGENT_ID,
      text: { 
        content: `⏰ 定时提醒\n时间：${new Date().toLocaleString()}\n内容：您的自定义消息` 
      }
    };
    
    await axios.post(url, data);
    console.log('✅ 消息发送成功:', new Date().toLocaleString());
  } catch (error) {
    console.error('❌ 发送失败:', error.message);
  }
}

// 每天 9:00 和 14:00 发送
cron.schedule('0 9,14 * * *', sendMessage);
console.log('🤖 企业微信定时机器人已启动...');
console.log('⏰ 定时规则：每天 9:00 和 14:00 发送消息');
{
  "name": "wechat-work-bot",
  "version": "1.0.0",
  "description": "企业微信定时消息机器人",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "node-cron": "^3.0.3"
  }
}
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com/ && npm install
COPY . .
CMD ["npm", "start"]
