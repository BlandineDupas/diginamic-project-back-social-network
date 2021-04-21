const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors')

const app = express();
const sequelize= new Sequelize('sqlite:database.db');

const SECRET = process.env.SECRET || 'xxx';
const PORT = process.env.PORT || 8000

const corsOptions = {
    origin: process.env.REACT_URL,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routers
const { userRouter } = require('./user/router');
const { messageRouter } = require('./message/router');
const { commentRouter } = require('./comment/router');

// Models
const { userModel } = require('./user/model');
const { messageModel } = require('./message/model');
const { commentModel } = require('./comment/model');

const USER = userModel(sequelize);
const MESSAGE = messageModel(sequelize);
const COMMENT = commentModel(sequelize);

const { joinTables } = require('./db-setup'); // {} pour recevoir une fonction et non un objet
joinTables(sequelize);

app.use('/api', userRouter(USER, sequelize, SECRET)); // concatène /api avec les routes du router
app.use('/api', messageRouter(MESSAGE, sequelize, SECRET));
app.use('/api', commentRouter(COMMENT, sequelize, SECRET));


sequelize
    .sync()
    .then(() => 
        app.listen(PORT, () => console.log('Social Network API started on ' + PORT + 'port'))
    );