const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexConnection = require('../data/db-config')
const projectRouter = require('../project/users-router.js')

const server = express();

// session configuration
const sessionOptions = {
    name: 'Session',
    secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!', // for encryption
    cookie: {
        secure: process.env.COOKIE_SECURE || false, // in production should be true, false for development
        maxAge: 1000 * 60 * 60 * 24, // how long is the session good for, in milliseconds
        httpOnly: true, // client JS has no access to the cookie
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: knexConnection,
        createtable: true,
        clearInterval: 1000 * 60 * 60, // how long before we clear out expired sessions
    }),
};
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));


server.use('/api', projectRouter);

server.get('/', (req, res) => {
    res.json({ api: 'up and running', session: req.session });
});

module.exports = server;