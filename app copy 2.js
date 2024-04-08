const express = require("express");
const bcrypt = require("bcryptjs"); 
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const db = require("./utils/mysql2-connect.js");
const cors = require("cors");

const MysqlStore = mysqlSession(session);
const sessionStore = new MysqlStore({}, db);

const app = express();

app.set("view engine", "ejs");

// top-level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "kdjfsk94859348JHGJK85743",
    store: sessionStore,
    //cookie: {
    //  maxAge: 1200_000,
    //}
  })
);

// 自訂的頂層的 middlewares
app.use((req, res, next) => {
  res.locals.title = "小新的網站";
  res.locals.pageName = "";
  res.locals.session = req.session; // 讓 ejs 可以使用 session
  res.locals.originalUrl = req.originalUrl;
  next();
});

app.get("/login", (req, res) => { 
  res.render("login");
});
 
app.get("/logout", (req, res) => {
  // if(req.session && req.session.admin){
    // 可以更改成下方寫法
    if(req.session?.admin){
    delete req.session.admin;
  }
  // res.redirect("/login")
  if(req.query.u){
    res.redirect(req.query.u);
  }else{
    res.redirect("/");
  }
});
app.post("/login",async (req,res)=>{ 
  let {account, password} = req.body || {};
  const output={
    success:false,
    error:"",
    code:0,
    postData:req.body
  }
  if(!account || !password){ 
    output.error="欄位資料不足"
    output.code=400
    return res.json(output)
  }
  account = account.trim();
  password = password.trim();
  const sql="select * from members where email=?";
  const [rows]=await db.query(sql,[account]);
  if(!rows.length){
    output.error="帳號或密碼為誤"
    output.code=420
    return res.json(output)
  }
  const result=await bcrypt.compare(password,rows[0].password);
  // output.result=result;
  if(result){
    output.success=true;
    req.session.admin={
      id:rows[0].id,
      email:account,
      nickname:rows[0].nickname
    }
  }else{
    // 密碼錯誤
    output.error="帳號或密碼錯誤"
    output.code=450

  }
  res.json(output);
})

/* ************** 其他的路, 放在這行之前 *********** */
// 靜態內容的資料夾

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
