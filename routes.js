
const paypal = require("./controllers/paypalController")
const jsonTable = require("./controllers/jsonTableConsroller")
const jsonForm = require("./controllers/jsonFormConsroller")
const upload = require('./utils/multer');
const bcrypt = require('bcrypt');
var express = require('express'); // 調用express模塊
const jwt =require("jsonwebtoken");
// 建立紀錄表 安全考量
// 確保token真的有存在
// 不是仿的
let refreshTokens=[];

const db = require("./utils/mysql2-connect.js");
const app = express.Router();
const auth = async (req, res, next) => {
    console.log("Dd")
    const token = req.headers["authorization"];
    // access token
    if(!token){
        return res.json({success:false,auth:"no token"})
    }
    const accessToken = token.split(" ")[1]; // 将 token 赋值给 accessToken
    jwt.verify(accessToken, process.env.secret, (err, user) => {
        if (!err) {
            req.custom_id = user; 
            next();
        } else {
            // 有可能過期
            return res.status(403).json({ error:accessToken,message: "User not authenticated" });
        }
    });
};

app.get("/",auth, async (req, res) => {
    const data = `SELECT * FROM custom `
    let [rows] = (await db.query(data));
    return res.json(rows)
})

app.post("/renewAccessToken",(req,res)=>{
    const refreshToken=req.body.token;
    const cu_id=req.body.custom_id = 1;
    const cu_pa= req.body.password = "a123";
    const data0={cu_id,cu_pa}
console.log(refreshToken)
    // 確認retoken是否真的存在
    if(!refreshToken || !refreshTokens.includes(refreshToken)){

        return res.status(403).json({message:"User not authenticated",data:refreshTokens.includes(refreshToken)});
    }
    jwt.verify(refreshToken,process.env.resecret,(err,user)=>{
        if(!err){
            const accessToken=jwt.sign(data0,process.env.secret,{expiresIn:"40s"});
            return res.status(201).json({success:true,accessToken});
        }else{
            return res.status(403).json({message:"user not authenticated"});
        }
    });
})
app.post("/api/login", async (req, res) => {
    req.body.custom_id = 1;
    req.body.password = "a123";
    const { custom_id, password } = req.body;
    console.log(JSON.stringify(req.body))
    const user1 = `select * from custom where custom_id=${custom_id} `
    let [rows ] = await db.query(user1); //isUser 
    if (rows.length > 0) {
      
        const state = bcrypt.compareSync(req.body.password,rows[0].custom_password) 
        if(state){
              // 生成 JWT
              const accessToken=jwt.sign({id:custom_id},process.env.secret,{expiresIn:"40s"});
              const refreshToken=jwt.sign({id:custom_id},process.env.resecret,{expiresIn:"20m"});
              refreshTokens.push(refreshToken);
            return res.status(201).json({success:true,accessToken,refreshToken,refreshTokens})
            // return res.json({success:true,accessToken})
        }
    }

    return res.json(rows)

})
app.get("/api/login", async (req, res) => {
  return res.render("login");

})
app.get("/api/paypal",auth, async (req, res) => {
    return res.render("paypal");
  
  })
app.get("/api/profile",async (req,res)=>{
//  找到用戶是誰
  // 處理 JWT token
  const auth = req.get("Authorization");
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7); // 去掉 "Bearer "
    try {
      // res.locals.my_jwt
      req.my_jwt = jwt.verify(token, process.env.secret);
    } catch (ex) {}
  }
    

    res.send(user)
})
app.post("/register", jsonTable.hellojsonTable)
app.get("/update", async (req, res) => {
    const sql = "UPDATE custom SET custom_password = ? WHERE custom_id = 1";
    let password = require("bcrypt").hashSync("a123", 10)
    let [rows] = (await db.query(sql, password));
    return res.json(rows)
})
// 
app.post("/create", jsonForm.jsonFormTa);
app.post("/bigImg", upload.single('file'), jsonForm.ImgFormTa);
app.post("/insertMemberForm", jsonForm.insertMemberForm);
app.post("/updateMemberForm", jsonForm.updateMemberForm);
app.post("/paypalPayMoney", paypal.paypalPayMoney);
app.get("/paypalPayMoney/client_token", paypal.clientToken);


// 連接paypal


module.exports = app;