const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('../data/db-config');
const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());


server.post('/register', (req,res) =>{
    const user = req.body;
    const hash = bcrypt.hashSync(user.password);
    user.password = hash;
    Users.add(user)
        .then(saveUser => {
            res.status(201).json(saveUser)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/login', (req,res) =>{
    const {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `We meet again, ${user.username}!` });
            } else {
                res.status(401).json({ message: 'YOU SHALL NOT PASS!!!' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
})

server.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({message: 'YOU SHALL NOT PASS!!!'})
        })
});

module.exports = server;