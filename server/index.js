require('dotenv').config()
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors')
const knex = require('knex');
const { off } = require('process');
const fetch = require('node-fetch');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : process.env.DB_PASS,
      database : 'facerecog'
    }
  });
 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(express.static(__dirname + '/public'));
app.use(cors());

app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)});
app.post('/register', (req,res) => {register.handleRegister(req,res, db, bcrypt)})
app.get('/profile/:id', (req,res) => {profile.handleGetUserProfile(req,res,db)});
app.put('/image', (req,res) => { image.handleImage(req,res,db)})
app.post('/imageurl', (req,res)=> {image.handleAPICall(req,res,fetch)})


app.listen(process.env.SERVER_PORT, () => {
    console.log("server up");
});


/* const http = require('http');

const server = http.createServer( (req,res) => {
    console.log('server online')
}) 

server.listen(3001); //listening to connections 

fs.readFile('./test.txt', (err, data) => {
    if(err) {
        console.log('error')
    }
    console.log(data)
})

*/