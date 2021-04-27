const Sequelize = require('sequelize');

const sequelize= new Sequelize('sqlite:database.db');

const { userModel } = require('./user/model');
const { postModel } = require('./post/model');
const { commentModel } = require('./comment/model');
const { proposedInvitesModel } = require('./user_user/proposed_invites');
const { receivedInvitesModel } = require('./user_user/received_invites');

const USER = userModel(sequelize);
const POST = postModel(sequelize);
const COMMENT = commentModel(sequelize);
proposedInvitesModel(sequelize);
receivedInvitesModel(sequelize);

module.exports = sequelize;
