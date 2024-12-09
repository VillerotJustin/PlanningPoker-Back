const fs = require("fs")
const mysql = require("mysql")
require('dotenv').config();

function readFile(file){
    var initSQL = fs.readFileSync(file, {encoding:"utf-8", flag:"r"})
    return initSQL.replaceAll("`DATABASE`", process.env.DB_DATABASE);
}

const dbConnection = mysql.createConnection({
    multipleStatements: true,
    namedPlaceholders : true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

function startDatabase(dbConnection, queryPath="./database/initDB.sql", testData="./database/testData.sql"){
    dbConnection.connect((err) => {
        if (err) console.error(err)
        else {
            console.log("DB Connected!")
            dbConnection.query(readFile(queryPath))
            dbConnection.query('SELECT COUNT(1) AS count FROM poker.story', (err, data) => {
                if (data.length != 0 && data[0].count == 0){
                    dbConnection.query(readFile(testData))
                }
            })
        }
    })
}

startDatabase(dbConnection)
module.exports = {dbConnection};