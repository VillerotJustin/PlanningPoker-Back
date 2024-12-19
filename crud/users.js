const {dbConnection} = require('../database/database');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs.
 *     responses:
 *       200:
 *         description: Une liste des utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 */
GetUsers = (res) => {
    dbConnection.query("SELECT * FROM User", (err, data) => {
        res.send(data)
    })
}

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Récupère un utilisateur spécifique par son nom d'utilisateur.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Le nom d'utilisateur de l'utilisateur à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Les détails de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       418:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: User not found.
 */
GetUser = (req, res) => {
    dbConnection.query(`SELECT * FROM User WHERE username="${req.params.username}"`, (err,data) => {
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

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Supprime un utilisateur par son nom d'utilisateur.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Le nom d'utilisateur de l'utilisateur à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Échec de la suppression ou utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: false
 */
DeleteUser = (req,res) => {
    dbConnection.query(`DELETE FROM User WHERE username="${req.params.username}"`, (err, data)=>{
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur pour le nouvel utilisateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe pour le nouvel utilisateur.
 *     responses:
 *       200:
 *         description: Succès de la création de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       418:
 *         description: Échec de la création de l'utilisateur ou paramètres manquants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Missing parameters.
 */
CreateUser = (req, res) => {
    console.log(req)
    if (req.body != undefined && req.body.username && req.body.password){
        dbConnection.query(`INSERT INTO User VALUES ('${req.body.username}', '${req.body.password}')`, (err, data)=>{
            if (err) {res.status(418); res.send(false); console.log(err)}
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