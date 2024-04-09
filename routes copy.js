  const jsonTable =require("./controllers/jsonTableConsroller") 
 const jsonForm =require("./controllers/jsonFormConsroller")  
 const upload = require('./utils/multer');
var express = require('express'); // 調用express模塊
const app = express.Router();
app.get("/",jsonTable.hellojsonTable)  
app.post("/create", jsonForm.jsonFormTa);
app.post("/bigImg", upload.single('file'), jsonForm.ImgFormTa);
app.get("/selectCustom", jsonForm.selectCustom);
app.post("/insertMemberForm", jsonForm.insertMemberForm);
app.post("/updateMemberForm", jsonForm.updateMemberForm);


module.exports = app;