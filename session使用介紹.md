<!-- https://ithelp.ithome.com.tw/articles/10258220?sc=pt -->
<!-- https://ithelp.ithome.com.tw/articles/10228375 -->
Cookie 是存放在 Client端。Session 是存放在 Sever端。
將 sessionID 會以以下形式儲存在 cookie
key: connect.sid（或自訂）
value: s:{sessionID}.{hmac-sha256(sessionID, secret)}



1.引入MOD
const session = require("express-session")

2.session設定 ; secret必要
 app.use(
      session({                       
          secret: "passwordE$%*&%$*"    
      })
    )

3.設定session
 router.post('/login', function(req, res, next) {
      //req.body.txtID的body需要express.urlencoded解碼
      var userName = req.body.txtID;    
      req.session.userName = req.body.txtID; //設定session
      res.send('NAME:'+ userName); //login網頁 , {}login的內容
   });

<!-- 轉跳頁面 res.redirect("http://www.yahoo.com") -->
  res.render('index', { userName:req.session.userName || "Guset" });