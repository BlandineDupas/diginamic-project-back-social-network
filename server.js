const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors')

// Routers
const { userRouter } = require('./user/router');
const { messageRouter } = require('./message/router');

const app = express();
const sequelize= new Sequelize('sqlite:database.db');

const SECRET = process.env.SECRET || 'xxx';
const PORT = process.env.PORT || 8000

const corsOptions = {
    origin: process.env.REACT_URL,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', userRouter(sequelize, SECRET)); // concatène /api avec les routes du router
app.use('/api', messageRouter(sequelize, SECRET));

sequelize
    .sync()
    .then(() => 
        app.listen(PORT, () => console.log('Social Network API started on ' + PORT + 'port'))
    );