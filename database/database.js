const fs = require("fs")
const mysql = require("mysql")
require('dotenv').config();

function readFile(file){
    var initSQL = fs.readFileSync(file, {encoding:"utf-8", flag:"r"})
    return initSQL.replaceAll("`DATABASE`", process.env.DATABASE);
}

const dbConnection = mysql.createConnection({
    multipleStatements: true,
    namedPlaceholders : true,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
})

function startDatabase(dbConnection, query="./database/initDB.sql"){
    dbConnection.connect((err) => {
        if (err) console.error(err)
        else {
            console.log("DB Connected!")
            dbConnection.query(readFile(query))
        }
    })
}

startDatabase(dbConnection)

module.exports = {dbConnection};