const { Model, DataTypes } = require('sequelize');

class RECEIVED_INVITE extends Model {}

exports.receivedInvitesModel = (sequelize) => {
    RECEIVED_INVITE.init(
        {
            status: DataTypes.STRING,
        },
        { sequelize }
    );
    return RECEIVED_INVITE;
};