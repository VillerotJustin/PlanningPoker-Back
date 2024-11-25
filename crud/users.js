const {dbConnection} = require('../database/database');

GetUsers = (res) => {
    dbConnection.query("SELECT * FROM user", (err, data) => {
        res.send(data)
    })
}

GetUser = (req, res) => {
    dbConnection.query(`SELECT * FROM user WHERE username="${req.params.username}"`, (err,data) => {
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
}

DeleteUser = (req,res) => {
    dbConnection.query(`DELETE FROM user WHERE username="${req.params.username}"`, (err, data)=>{
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
}

CreateUser = (req, res) => {
    console.log(req)
    if (req.body && req.body.username && req.body.password){
        dbConnection.query(`INSERT INTO user VALUES ('${req.body.username}', '${req.body.password}')`, (err, data)=>{
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
}

module.exports = {GetUser, GetUsers, CreateUser, DeleteUser}