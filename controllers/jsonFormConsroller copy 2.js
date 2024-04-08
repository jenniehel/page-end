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
        const imagePath = path.join(__dirname, '../public', 'images');

        if (!req.file) {
            return res.status(400).json({message:'No file uploaded.'});
        }
        fs.readFile(imagePath, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(404).send('Image not found');
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
          }); 

        // res.json({status:'Success',data:{
        //     filename: req.file.originalname,
        //     mimetype: req.file.mimetype,
        //     size: req.file.size
        //   }});
    }
} 