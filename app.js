const express = require("express")
const pm = require('./partyManager')
const {GetUser, GetUsers, CreateUser, DeleteUser} = require("./crud/users")
const {GetRoom, GetRooms, CreateRoom, DeleteRoom, UpdateRoom, StoriesOfRoom} = require("./crud/rooms")
const {GetStory, GetStories, CreateStory, DeleteStory, UpdateStory} = require("./crud/stories")
require('dotenv').config();

const swaggerOpt = require('./swaggerOptions');
const swaggerUi = require('swagger-ui-express');

const app = express()
const port = process.env.API_PORT
  
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOpt, { explorer: true })
  );

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
    console.log("Listening on port "+port)
})

app.get("/", (req, res) => {
    res.status(418)
    res.send("Hello world!")
})

//USERS
app.get("/users", (req, res) => {
    GetUsers(res)
})

app.get("/users/:username", (req, res) => {
    GetUser(req,res)
})

app.delete("/users/:username", (req,res) => {
    DeleteUser(req, res)
})

app.post("/users", (req, res) => {
    CreateUser(req,res)
})
// END USERS

// ROOMS
app.get("/rooms", (req, res) => {
    GetRooms(res)
})

app.get("/rooms/:id", (req, res) => {
    GetRoom(req, res)
})

app.delete("/rooms/:id", (req,res) => {
    DeleteRoom(req, res)
})

app.post("/rooms", (req, res) => {
    CreateRoom(req, res)
})

app.put("/rooms/:id", (req, res) => {
    UpdateRoom(req, res)
})

app.get("/rooms/stories/:id", (req, res) => {
    StoriesOfRoom(req, res)
})
// END ROOMS

// STORIES
app.get("/stories", (req, res) => {
    GetStories(res)
})

app.get("/stories/:id", (req, res) => {
    GetStory(req, res)
})

app.delete("/stories/:id", (req,res) => {
    DeleteStory(req, res)
})

app.post("/stories", (req, res) => {
    CreateStory(req, res)
})

app.put("/stories/:id", (req, res) => {
    UpdateStory(req, res)
})
// END STORIES

module.exports = app;