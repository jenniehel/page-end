const express =require("express");
const { z } = require("zod");
const  bcrypt = require("bcryptjs");
// 引入cors模組，用於實現跨源資源共享
const cors =require( "cors");
const dayjs = require("dayjs");
const session = require('express-session')
//  將數據上傳至mysql資料庫
const mysqlSession =require ("express-mysql-session");
const MysqlStore = mysqlSession(session);
const db= require ("./utils/mysql2-connect.js");
const sessionStore = new MysqlStore({}, db);
const app = express();
app.set("view engine", "ejs");

// 使用動態來源設定 CORS
const corsOptions = {
   // 動態確定允許的源 
   // 使用默認CORS配置为所有路由添加CORS支持
   // app.use(cors()); //app.use(cors({origin:"*"}));
   // 
   // 定義CORS選項
   // var corsOptions = {
   //     origin: 'http://example.com',
   //     optionsSuccessStatus: 200 // 一些舊版瀏覽器的兼容性處理
   //   };
   origin: function (origin, callback) {
       if (whitelist.indexOf(origin) !== -1) {
           callback(null, true)
       } else {
           callback(new Error('Not allowed by CORS'))
       }
   }
}
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//   設定session
app.use((req, res, next) => {
   session({
       // 是否將未初始化的 session 保存到存儲。（新產生的 Session）
       saveUninitialized: true,
       // 是否強制將 session 保存回存儲
       resave: true,
       //   secret:型態為字串,作為Server端生session的簽章 (必要)
       secret: "kdjfsk94859348JHGJK85743",
       store: sessionStore,
       //cookie: { 
       // path:cookie存放在Client端的路徑·預設為/
       //   path: '/',
       // 是否可以Server更改Cookie
       //   httpOnly: true,
       // 是否只在HTTPS協定中使用Cookie
       //   secure: false,
       // 設定cookie存活時間
       //   maxAge:5*1000
       //}
   })
   next();
}

);
// 自訂的頂層的 middlewares
app.use((req, res, next) => {
   // 網站的標題資訊
   res.locals.title = "簡單的網站";
   // 當前頁面的名稱
   res.locals.pageName = "";
   res.locals.session = req.session; // 讓 ejs 可以使用 session
   // 請求的原始 URL
   res.locals.originalUrl = req.originalUrl;
   next();
});
// 抓public/index.html (靜態路由)
// app.use(express.static(path.join(__dirname, 'public'))); 
// 抓不到時抓views內 (動態路由)
// app.use('/', indexRouter); 
app.get("/login", (req, res) => {
   // if(req.session.admin){
   //   // 如果此用戶已經登入了, 跳轉到首頁
   //   return res.redirect("/")
   // }
   res.render("login");
 });
 app.post("/login",async (req,res)=>{
   console.log(req.session)
   req.session = true;
   console.log(req.session)

   // let {account,password}=req.body||{};
   // console.log({account,password})
   // const output={
   //     success:false,
   //     error:"",
   //     code:0,
   //     postData:req.body
   // }
   // if(!account || !password){
   //     output.error="欄位有誤";
   //     output.code=400;
   //     return res.json(output)
   // }
   // account=account.trim();
   // password=password.trim();
   // const sql="select * from members where email=?"; 

   // const [rows]=await db.query(sql,[account]);
   // if(!rows.length){
   //     output.error-"帳號或密碼錯誤"
   //     output.code=420
   //     return res.json(output)
   // }
   // const result=await bcrypt.compare(password,rows[0].password);
   // if(result){
   //     output.success=true;
   //     // req.session.admin={
   //     //     id:rows[0].id,
   //     //     email:rows[0].email,
   //     //     nickname:rows[0].nickname
   //     // }
   //     req.session.admin=true;

   // }else{
   //     output.error="帳號或密碼錯誤"
   //     output.code=450
   // }
//   res.json(output);

 })

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
   console.log(`伺服器啟動 使用通訊 http://127.0.0.1:${port}`)
})
