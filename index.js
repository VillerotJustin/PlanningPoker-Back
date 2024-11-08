const express = require("express")
const fs = require("fs")

const app = express()
const port = 3000


const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
    database: "poker"
})

function readFile(file){
    return fs.readFileSync(file, {encoding:"utf-8", flag:"r"})
}


db.connect((err) => {
    if (err) console.error(err)
    console.log("DB Connected!")

    db.query(readFile("./initDB.sql"))
})

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.listen(port, () => {
    console.log("Listening on port 3000")
})