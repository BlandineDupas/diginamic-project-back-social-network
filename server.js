const express = require('express');
const Sequelize = require('sequelize');

// Routers
const { userRouter } = require('./user/router');

const app = express();
const sequelize= new Sequelize('sqlite:database.db');

app.use(express.json());

app.use('/api', userRouter(sequelize)); // concatène /api avec les routes du router

sequelize
    .sync()
    .then(() => 
        app.listen('8000', () => console.log('Social Network API started on 8000 port'))
    );