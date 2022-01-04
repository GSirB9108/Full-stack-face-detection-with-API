const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors')
const knex = require('knex');
const { off } = require('process');
const register = require('./controllers/register');

const clarifai = require('clarifai');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'ps1oq5sl9t',
      database : 'facerecog'
    }
  });
 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(express.static(__dirname + '/public'));
app.use(cors());

app.post('/signin', (req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json('incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then (data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
                .where('email','=',email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

app.post('/register', (req,res) => {register.handleRegister(req,res, db, bcrypt)})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user=>{
        if(user.length){
        res.json(user[0])
        } else {
            res.status(400).json('not found');    
        }
    })
    .catch(err => res.status(400).json('error finding user'))
});

app.put('/image', (req,res) => {
    const {id}= req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
});


app.listen(3001, () => {
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