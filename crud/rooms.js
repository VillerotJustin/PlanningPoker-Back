const {dbConnection} = require('../database/database');
require('dotenv').config();
dbConnection.query("USE "+process.env.DB_DATABASE+";")
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Récupère toutes les salles.
 *     responses:
 *       200:
 *         description: Une liste de salles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   mode:
 *                     type: integer
 *                   password:
 *                     type: string
 *                   owner:
 *                     type: string
 */
GetRooms = (res) => {
    dbConnection.query("SELECT * FROM Room", (err, data) => {
        res.send(data)
    })
}

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Récupère une salle spécifique par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la salle à récupérer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Les détails de la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 mode:
 *                   type: integer
 *                 password:
 *                   type: string
 *                 owner:
 *                   type: string
 *       418:
 *         description: Salle introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Room not found.
 */
GetRoom = (req, res) => {
    dbConnection.query(`SELECT * FROM Room WHERE id="${req.params.id}"`, (err,data) => {
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
}

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Supprime une salle par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la salle à supprimer.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Échec de la suppression ou salle introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: false
 */
DeleteRoom = (req,res) => {
    console.log(`DELETE FROM Room WHERE id="${req.params.id}"`)
    dbConnection.query(`DELETE FROM Story WHERE roomId="${req.params.id}"`, (err, data)=>{
        if (err) {
            console.log(err)
            res.status(418)
            res.send(false)
        }
    })
    dbConnection.query(`DELETE FROM Room WHERE id="${req.params.id}"`, (err, data)=>{
        if (err) {
            console.log(err)
            res.status(418)
            res.send(false)
        }
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

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Crée une nouvelle salle.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la salle.
 *               mode:
 *                 type: integer
 *                 description: Le mode de la salle.
 *               password:
 *                 type: string
 *                 description: Le mot de passe pour accéder à la salle.
 *               owner:
 *                 type: string
 *                 description: Le propriétaire de la salle (nom d'utilisateur).
 *     responses:
 *       200:
 *         description: Succès de la création de la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Paramètres manquants ou propriétaire invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Invalid owner.
 */
CreateRoom = (req, res) => {
    if (req.body != undefined && req.body.name != undefined && req.body.mode != undefined && req.body.password != undefined && req.body.owner != undefined){

        dbConnection.query(`SELECT * FROM User WHERE username='${req.body.owner}'`, (err, data) => {
            if (data.length == 1){
                dbConnection.query(`INSERT INTO Room (name, mode, password, owner) VALUES ('${req.body.name}', ${req.body.mode}, '${req.body.password}', '${req.body.owner}')`, (err, data)=>{
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
}

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Met à jour une salle existante par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la salle à mettre à jour.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de la salle.
 *               mode:
 *                 type: integer
 *                 description: Nouveau mode de la salle.
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe de la salle.
 *     responses:
 *       200:
 *         description: Succès de la mise à jour de la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Paramètres manquants ou salle introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Invalid room.
 */
UpdateRoom = (req, res) => {
    // name / slots / mode / password
    if (req.body != undefined && (req.body.name != undefined || req.body.mode != undefined || req.body.password != undefined)){

        dbConnection.query(`SELECT * FROM Room WHERE id='${req.params.id}'`, (err, data) => { // Item exist ?
            if (data.length == 1){
                // Construct params
                let params = ""
                if (req.body.name != undefined) params += `name='${req.body.name}',`
                if (req.body.mode != undefined) params += `mode=${req.body.mode},`
                if (req.body.password != undefined) params += `password='${req.body.password}',`
                params = params.slice(0, -1)

                dbConnection.query(`UPDATE Room SET ${params} WHERE id=${req.params.id}`, (err, data) => {
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
        return res.send({err:"Wrong or missing parameters. (name || mode || password)"})
    }
}

/**
 * @swagger
 * /rooms/{id}/stories:
 *   get:
 *     summary: Récupère toutes les histoires associées à une salle spécifique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de la salle.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Une liste d'histoires associées à la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   value:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 */
StoriesOfRoom = (req, res) => {
    dbConnection.query(`SELECT * FROM Story WHERE roomId="${req.params.id}"`, (err,data) => {
        if (err) console.log(err)
        else {
            res.send(data)
        }
    })
}

module.exports = {GetRoom, GetRooms, CreateRoom, DeleteRoom, UpdateRoom, StoriesOfRoom}