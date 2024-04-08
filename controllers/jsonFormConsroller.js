const db = require("../utils/mysql2-connect.js");
const fs = require('fs');
const path = require('path');

module.exports = { 
    async jsonFormTa(req, res) { 
        const sql="insert into products (`author`,`bookname`,`category_sid`,`image`)values(?)"
        const values=[
            req.body.author,
            req.body.bookname,
            req.body.category_sid, 
            req.file.filename 
        ]  
        await db.query(sql, [values])
        .then((res2) => {   
            if (!res2) {
                return res.json({ error: "Error in signup query" });
            } else {
                return res.send({ status: "Success" });
            } 
        })
        .catch((err) => {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "An error occurred while processing the request" });
        });
    },
    async ImgFormTa(req,res){  
        // 上傳圖片資料

        if (!req.file) {
            return res.status(400).json({message:'No file uploaded.'});
        }
        res.json({status:'Success',data:{
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
          }});
    },
    async insertMemberForm(req,res){ 
        // 新增顧客資料
        const {idInputErr,passwordErr,}=req.body
        const sql="insert into custom (`custom_password`,`custom_nickname`,`custom_descript`,`custom_sex`,`custom_name`,`custom_year`,`custom_month`,`custom_date`)values(?)"
        const values=[ 
            req.body.custom_password,
            req.body.custom_nickname,
            req.body.custom_descript,
            req.body.custom_sex, 
            req.body.custom_name,
            req.body.custom_year,
            req.body.custom_month,
            req.body.custom_date,
        ]   
        await db.query(sql, [values])
        .then((res2) => {   
            if (!res2) {
                return res.json({status:401, error: "Error in signup query" });
            } else {
                return res.send({ status: "Success" });
            } 
        })
        .catch((err) => {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "An error occurred while processing the request" });
        });
    },
    async updateMemberForm(req,res){ 
        // 新增顧客資料
        const sql = "UPDATE custom SET custom_password = ?, custom_nickname = ?, custom_descript = ?, custom_sex = ?, custom_name = ?, custom_year = ?, custom_month = ?, custom_date = ? WHERE custom_id = ?";
        const values=[ 
            req.body.custom_password,
            req.body.custom_nickname,
            req.body.custom_descript,
            req.body.custom_sex, 
            req.body.custom_name,
            req.body.custom_year,
            req.body.custom_month,
            req.body.custom_date,
            req.body.custom_id,
        ]  
        await db.query(sql, values)
        .then((res2) => {   
            if (!res2) {
                return res.json({status:401, error: "Error in signup query" });
            } else {
                return res.send({ status: "Success" });
            } 
        })
        .catch((err) => {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "An error occurred while processing the request" });
        });
    },
    async deleteMemberForm(req,res){

    }
} 