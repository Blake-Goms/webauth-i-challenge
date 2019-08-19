const express = require('express');

const projectRouter = require('../project/users-router.js')

const server = express();

server.use(express.json());
server.use('/api', projectRouter);

module.exports = server;