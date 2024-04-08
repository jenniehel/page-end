
const db = require("../utils/mysql2-connect.js");

module.exports = {
    async hellojsonTable(req, res) {
        let page = req.query.page || 1;
        const perPage = 25;
        let keyword = req.query.keyword || ""
        let where = "where 1";
        let totalPages=0;
        let rows=0;
        if (page < 1) {
            return { success: false, redirect: "?page=1" };
        }

        if (keyword) { where = `where ${keyword}` };
        // const data = `SELECT * FROM address_book`
        const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
        const [[{ totalRows }]] = await db.query(t_sql); 
        if (!totalRows) {
            return ({ success: false, message: "無資料" })
        }else{
            totalPages=Math.ceil(totalRows / perPage); 
            if(totalPages < page){
                const newQuery = { ...req.query, page: totalPages };
                const qs = new URLSearchParams(newQuery).toString();
                return { success: false, redirect: `?` + qs };
            }

// const newQuery = {
//     keyword: 'apple',
//     category: 'fruits',
//     page: 2
// };new URLSearchParams(newQuery)
// "keyword=apple&category=fruits&page=2"


    //         -- 依 name 排序後，取第 5 ~ 7 筆資料
    //         SELECT * FROM persons ORDER BY name LIMIT 4, 3;
              data = `SELECT * FROM address_book  ${where}    ORDER BY sid DESC  LIMIT ${(page-1)*perPage} , ${perPage} `
              let [rows]= (await db.query(data));
          
            res.render("json-table/json-table", {
                success: true,
                totalRows,
                totalPages,
                page,
                perPage,
                rows,
                query: req.query,
            })
        }
      

    },
    async jsonTableSearch(req, res) {

    }
} 