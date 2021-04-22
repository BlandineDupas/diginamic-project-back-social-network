const { Model, DataTypes } = require('sequelize');

class PROPOSED_INVITE extends Model {}

exports.proposedInvitesModel = (sequelize) => {
    PROPOSED_INVITE.init(
        {
            status: DataTypes.STRING,
        },
        { sequelize }
    );
    return PROPOSED_INVITE;
};