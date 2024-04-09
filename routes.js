  
const paypal =require("./controllers/paypalController") 
const jsonTable =require("./controllers/jsonTableConsroller") 
const jsonForm =require("./controllers/jsonFormConsroller")  
const upload = require('./utils/multer');
var express = require('express'); // 調用express模塊
const app = express.Router();

app.get("/",jsonTable.hellojsonTable)  
app.post("/create", jsonForm.jsonFormTa);
app.post("/bigImg", upload.single('file'), jsonForm.ImgFormTa);
app.post("/insertMemberForm", jsonForm.insertMemberForm);
app.post("/updateMemberForm", jsonForm.updateMemberForm);  
app.post("/paypalPayMoney", paypal.paypalPayMoney);
app.get("/paypalPayMoney/client_token", paypal.clientToken); 

 
// 連接paypal


module.exports=app;