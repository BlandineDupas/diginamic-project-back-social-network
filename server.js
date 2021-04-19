const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors')

// Routers
const { userRouter } = require('./user/router');

const app = express();
const sequelize= new Sequelize('sqlite:database.db');

const SECRET = process.env.SECRET || 'xxx';

const corsOptions = {
    origin: process.env.REACT_URL,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', userRouter(sequelize, SECRET)); // concatène /api avec les routes du router

sequelize
    .sync()
    .then(() => 
        app.listen('8000', () => console.log('Social Network API started on 8000 port'))
    );