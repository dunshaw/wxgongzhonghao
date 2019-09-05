const express = require('express');
const app = express(); 

// 引入auth模块
const auth = require('./wechat/auth');

// 接收处理所有消息
app.use(auth());

// 监听端口
app.listen(3000,()=> console.log('go~~~'))