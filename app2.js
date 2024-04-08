const express = require('express');
const session = require('express-session');

const app = express();

// 設置 session 中間件
app.use(session({
  secret: 'your_secret_key', // 用於加密 session 的密鑰
  resave: false, // 是否強制將 session 保存回存儲
  saveUninitialized: true // 是否將未初始化的 session 保存到存儲
}));

// 登錄路由處理器
app.get('/login', (req, res) => {
  // 假設在用戶登錄成功時，將 admin 設置為 true
  req.session.admin = "true";
  console.log(req.session)
  res.send('Login successful');
});

// 其他路由處理器，在其中檢查 admin 屬性是否已設置
app.get('/', (req, res) => {
  // 檢查 admin 屬性是否存在且為 true
  if (req.session?.admin === true) {
    res.send('You are an admin');
  } else {
    res.send('You are not an admin');
  }
});

// 啟動服務器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});