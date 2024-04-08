const  mysql =require ("mysql2/promise");
const {DB_HOST,DB_USER,DB_PASS,DB_Name}=process.env;
console.log({DB_HOST,DB_USER,DB_PASS,DB_Name});
const db=mysql.createPool({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASS,
    database:DB_Name,
    waitForConnections:true,
    connectionLimit:5,
    queueLimit:0
})
module.exports =db;