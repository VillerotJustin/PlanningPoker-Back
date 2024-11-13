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

//defaults headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//

app.listen(port, () => {
    console.log("Listening on port 3000")
})

db.connect((err) => {
    if (err) console.error(err)
    console.log("DB Connected!")

    db.query(readFile("./initDB.sql"))
})


///////////////
app.get("/", (req, res) => {
    res.status(418)
    res.send("Hello world!")
})

app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, data) => {
        res.send(data)
    })
})

app.get("/users/:username", (req, res) => {
    db.query(`SELECT * FROM user WHERE username="${req.params.username}"`, (err,data) => {
        if (err) console.log(err)
        else {
            if (data.length == 0){
                res.status(418)
                res.send({err:"User not found."})
            }else{
                res.send(data[0])
            }
        }
    })
})

app.delete("/users/:username", (req,res) => {
    console.log(`DELETE FROM user WHERE username="${req.params.username}"`)
    db.query(`DELETE FROM user WHERE username="${req.params.username}"`, (err, data)=>{
        if (err) console.log(err)
        else {
            if (data.affectedRows == 1){
                res.send(true)
            }else{
                res.status(418)
                res.send(false)
            }
        }
    })
})

app.post("/users", (req, res) => {
    console.log(req)
    if (req.body && req.body.username && req.body.password){
        db.query(`INSERT INTO user VALUES ('${req.body.username}', '${req.body.password}')`, (err, data)=>{
            if (err) console.log(err)
            else {
                if (data.affectedRows == 1){
                    res.send(true)
                }else{
                    res.status(418)
                    res.send(false)
                }
            }
        })
        return
    }
    res.status(418)
    res.send({err:"Missing parameters."})
})
///////////////

///////////////
app.get("/rooms", (req, res) => {
    db.query("SELECT * FROM room", (err, data) => {
        res.send(data)
    })
})

app.get("/rooms/:id", (req, res) => {
    db.query(`SELECT * FROM room WHERE id="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            if (data.length == 0){
                res.status(418)
                res.send({err:"Room not found."})
            }else{
                res.send(data[0])
            }
        }
    })
})

app.delete("/rooms/:id", (req,res) => {
    console.log(`DELETE FROM room WHERE id="${req.params.id}"`)
    db.query(`DELETE FROM room WHERE id="${req.params.id}"`, (err, data)=>{
        if (err) console.log(err)
        else {
            if (data.affectedRows == 1){
                res.send(true)
            }else{
                res.status(418)
                res.send(false)
            }
        }
    })
})

app.post("/rooms", (req, res) => {
    if (req.body && req.body.name && req.body.slots && req.body.mode && req.body.password && req.body.owner){

        db.query(`SELECT * FROM user WHERE username='${req.body.owner}'`, (err, data) => {
            if (data.length == 1){
                db.query(`INSERT INTO room (name, slots, mode, password, owner) VALUES ('${req.body.name}', ${req.body.slots}, ${req.body.mode}, '${req.body.password}', '${req.body.owner}')`, (err, data)=>{
                    if (err) console.log(err)
                    else
                        if (data.affectedRows == 1){
                            return res.send(true)
                        }else{
                            res.status(418)
                            return res.send(false)
                        }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid owner."})
            }
        })
    }else{
        res.status(418)
        res.send({err:"Missing parameters."})
    }
})

app.put("/rooms/:id", (req, res) => {
    // name / slots / mode / password
    if (req.body && (req.body.name || req.body.slots || req.body.mode || req.body.password)){

        db.query(`SELECT * FROM room WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.slots) params += `slots=${req.body.slots},`
                if (req.body.mode) params += `mode=${req.body.mode},`
                if (req.body.password) params += `password='${req.body.password}',`
                params = params.slice(0, -1)

                db.query(`UPDATE room SET ${params} WHERE id=${req.params.id}`, (err, data) => {
                    if (err) console.log(err)
                    else {
                        if (data.affectedRows==0){
                            res.status(418)
                            res.send(false)
                        }else{
                            res.send(true)
                        }
                    }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid room."})
            }
        })
    }else{
        res.status(418)
        return res.send({err:"Wrong or missing parameters. (name || slots || mode || password)"})
    }
})
///////////////



///////////////
app.get("/stories", (req, res) => {
    db.query("SELECT * FROM story", (err, data) => {
        res.send(data)
    })
})

app.get("/stories/:id", (req, res) => {
    db.query(`SELECT * FROM story WHERE id="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            if (data.length == 0){
                res.status(418)
                res.send({err:"Story not found."})
            }else{
                res.send(data[0])
            }
        }
    })
})

app.delete("/stories/:id", (req,res) => {
    console.log(`DELETE FROM story WHERE id="${req.params.id}"`)
    db.query(`DELETE FROM story WHERE id="${req.params.id}"`, (err, data)=>{
        if (err) console.log(err)
        else {
            if (data.affectedRows == 1){
                res.send(true)
            }else{
                res.status(418)
                res.send(false)
            }
        }
    })
})

app.post("/stories", (req, res) => {
    if (req.body && req.body.name && req.body.description && req.body.value && req.body.roomId){

        db.query(`SELECT * FROM room WHERE id='${req.body.roomId}'`, (err, data) => {
            if (data.length == 1){
                db.query(`INSERT INTO story (name, description, value, roomId) VALUES ('${req.body.name}', ${req.body.description}, ${req.body.value}, '${req.body.roomId}')`, (err, data)=>{
                    if (err) console.log(err)
                    else
                        if (data.affectedRows == 1){
                            return res.send(true)
                        }else{
                            res.status(418)
                            return res.send(false)
                        }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid roomId."})
            }
        })
    }else{
        res.status(418)
        res.send({err:"Missing parameters."})
    }
})

app.put("/stories/:id", (req, res) => {
    // name / slots / mode / password
    if (req.body && (req.body.name || req.body.description || req.body.value || req.body.roomId)){

        db.query(`SELECT * FROM story WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name) params += `name='${req.body.name}',`
                if (req.body.description) params += `description=${req.body.description},`
                if (req.body.value) params += `value=${req.body.value},`
                params = params.slice(0, -1)

                db.query(`UPDATE story SET ${params} WHERE id=${req.params.id}`, (err, data) => {
                    if (err) console.log(err)
                    else {
                        if (data.affectedRows==0){
                            res.status(418)
                            res.send(false)
                        }else{
                            res.send(true)
                        }
                    }
                })
            }else{
                res.status(418)
                return res.send({err:"Invalid story."})
            }
        })
    }else{
        res.status(418)
        return res.send({err:"Wrong or missing parameters. (name || description || value)"})
    }
})
///////////////