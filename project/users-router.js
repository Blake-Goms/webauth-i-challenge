const server = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');

server.post('/auth/register', (req,res) =>{
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

server.post('/auth/login', (req,res) =>{
    const {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.username = user.username; // only on successful login
                req.session.loggedIn = true;
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                });
                } else {
                res.status(401).json({ message: 'Invalid Credentials' });
                }
        })
        .catch(error => {
            res.status(500).json(error);
        });
})

server.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ bye: 'log back in soon!' });
    });
});



// gets all users
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