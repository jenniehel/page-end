
 
const db = require("../utils/mysql2-connect.js"); 


module.exports = { 
 
 async    recordSearch(req, res) {
           const result={success:false,data:[]};
        
            //  const data = " SELECT o.order_id, o.custom_Id, od.order_quantity , od.product_id, p.product_name FROM `orders` o JOIN `order_details` od ON o.order_id = od.order_id JOIN `products` p ON od.product_id = p.product_id where o.custom_id=1";
            const data="SELECT DISTINCT o.order_id FROM orders o JOIN order_details od ON o.order_id = od.order_id JOIN products p ON od.product_id = p.product_id where o.custom_id=1"; 
            let [rows]= (await db.query(data)); 
            // 分段傳值顯示
            for (const v of rows) {
                const data2 = " SELECT o.order_id, o.custom_Id, od.order_quantity , od.product_id, p.product_name FROM `orders` o JOIN `order_details` od ON o.order_id = od.order_id JOIN `products` p ON od.product_id = p.product_id where o.custom_id=1 && o.order_id="+v.order_id;
                let [row2]= (await db.query(data2));
                console.log(row2)
                // console.log(row2)
                result.data.push([...row2]); 

            }
           res.send(result)
          


    },
  async    jsonTableSearch(req, res) {

    } 
} 