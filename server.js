const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');
const jwtMiddelware = require('express-jwt');

const app = express();
const sequelize= new Sequelize('sqlite:database.db');

const SECRET = process.env.SECRET || 'secret';
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
const { proposedInvitesModel } = require('./user_user/proposed_invites');
const { receivedInvitesModel } = require('./user_user/received_invites');

const USER = userModel(sequelize);
const MESSAGE = messageModel(sequelize);
const COMMENT = commentModel(sequelize);
const PROPOSED_INVITE = proposedInvitesModel(sequelize); // TODO suppress const and just initialise Model
const RECEIVED_INVITE = receivedInvitesModel(sequelize);

const { joinTables } = require('./db-setup'); // {} pour recevoir une fonction et non un objet
joinTables(sequelize);

/**
 * Ce middeware valide le JWT et rajoute un attribut user à la requete.
 * Cet attribut contient la payload du jeton
 */
app.use(
    jwtMiddelware({ secret: SECRET, algorithms: ['HS256'] }).unless({
        path: [
            '/api/login',
            { url: '/api/user', methods: ['POST'] }
        ],
    })
);

app.use('/api', userRouter(USER, sequelize, SECRET)); // concatène /api avec les routes du router
app.use('/api', messageRouter(MESSAGE, sequelize, SECRET));
app.use('/api', commentRouter(COMMENT, sequelize, SECRET));

sequelize
    .sync()
    .then(() => 
        app.listen(PORT, () => console.log('Social Network API started on ' + PORT + 'port'))
    );