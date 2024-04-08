const express = require("express");
const bcrypt = require("bcryptjs"); 
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const db = require("./utils/mysql2-connect.js");
const cors = require("cors");
const path = require('path');
const MysqlStore = mysqlSession(session);
const sessionStore = new MysqlStore({}, db);
const jsonTable =require("./routes")
const app = express(); 
app.set('view engine', 'ejs');
app.use(express.json());

// false querystring (string/array) true qs允許url編碼json(任何型態) 
app.use(express.urlencoded({extended:true}));


//cors 同源政策
// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
// origin：配置Access-Control-Allow-Origin :(1.boolean:是否停用)(2.設定特定origin)(3.RegExp)(4.aray+regexp)(5.function)
// methods：Access-Control-Allow-Methods:['GET', 'PUT', 'POST']
// allowedHeaders  標頭：配置Access-Control-Allow-Headers ex ['Content-Type', 'Authorization']
// credentials：配置Access-Control-Allow-Credentials CORS 標頭。設定為true傳遞標頭，否則省略。
// maxAge：配置Access-Control-Max-Age CORS 標頭。設定為整數以傳遞標頭，否則省略 。可以被伺服器儲存多久
const corsOptions={
  Credential:true,
  origin:(origin,callback)=>{
    callback(null,true);
  }
}
app.use(cors(corsOptions));

// https://johnnychang25678.medium.com/node-js-cookie-session%E9%A9%97%E8%AD%89%E5%8E%9F%E7%90%86%E4%BB%A5%E5%8F%8Aexpress-session%E5%A5%97%E4%BB%B6%E4%BD%BF%E7%94%A8-aeafa386837e
// session
// 預設 cookie \{ path: '/', httpOnly: true, secure: false, maxAge: null }
// 因為http stateless機制無法保存上次的request 只要重刷就會叫你登入
// so
// 我們需要把它存起來
// /secret :session ID 放入cookie
// name: 存放在cookie的key，如果不寫的話預設是connect.sid
// saveUninitialized:設定
// true:會把「還沒修改過的」session就存進session store 
// false :可避免存入太多空的 session
//resave: 每一次與使用者互動，是否強制保存 session 並更新到 session store 裡，預設是 true
// store：session在server 端的存放方式,預設 MemoryStore
// session 一般可以放在 (1.記憶體)(2.cookie本身)(3.緩存)(4.資料庫)
// 這邊存在資料庫 
app.use(session({
  saveUninitialized:true,
  resave:true,
  secret:"dafd;faekmcda",
  store:sessionStore
}))
// 自訂的頂層的 middlewares
//res.locals 設定使用者資訊的設定....
app.use((req, res, next) => {
  res.locals.title = "複習的網站";
  res.locals.pageName = "";
  res.locals.session = req.session; // 讓 ejs 可以使用 session
  res.locals.originalUrl = req.originalUrl;
  next();
});

app.get("/login", (req, res) => { 
  res.render("login");
});

app.post("/login",async (req,res)=>{
  let {account,password}=req.body || {};
  const output={
    success:false,
    error:"",
    code:"",
    propsData:req.body
  }
  if(!account || !password){
    output.error="欄位資料不足";
    output.code=400;
    return res.json(output)
  }
  account=account.trim();
  password=password.trim();
  const sql="select * from members where email=?";
  const [rows]=await db.query(sql,[account]);

  if(!rows.length){
    output.error="帳號或密碼為誤"
    output.code=420
    return res.json(output)
  }
  // 比較帳號密碼是否正確
  const result=await bcrypt.compare(password,rows[0].password);
  if(result){
    output.success=true;
    req.session.admin={
      id:rows[0].id,
      email:account,
      nickname:rows[0].nickname
    }
  }else{
    output.error="帳號或密碼錯誤"
    output.code=450;
  }
  res.json(output) 

})
app.get("/m", async(req,res)=>{
  const sql = "select * from address_book";
  const [rows] = await db.query(sql);
  return res.render("json-table/json-table",{rows}) 
})

 
 
// express.static(root,[options]) 設定靜態目錄
// app.use("/", express.static("public"));
// 
/* ************** 其他的路, 放在這行之前 *********** */
// 靜態內容的資料夾 
// 後端圖片資料夾
app.use('/images', express.static(path.join(__dirname, 'public/images')));
let index = require('./routes')
app.use('/backRoute', index) 
app.use("/", express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/jquery", express.static("node_modules/jquery/dist"));


/* 404 頁面 */
app.use((req, res) => {
  res.status(404).send(`<h2>404 走錯路了</h2>`);
});
const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`伺服器啟動 使用通訊埠 http://127.0.0.1:${port}`);
});
