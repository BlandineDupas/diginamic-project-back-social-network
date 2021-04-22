exports.joinTables = (sequelize) => {
    console.log('MODELS', sequelize.models);
    const { USER, MESSAGE, COMMENT } = sequelize.models;

    USER.hasMany(MESSAGE);
    MESSAGE.belongsTo(USER);

    USER.belongsToMany(USER, {
        through: 'PROPOSED_INVITE',
        as: 'proposed_invites',
        foreignKey: 'proposerId',
        otherKey: 'receiverId',
    });

    USER.belongsToMany(USER, {
        through: 'RECEIVED_INVITE',
        as: 'received_invites',
        foreignKey: 'receiverId',
        otherKey: 'proposerId',
    });



    // USER.belongsToMany(USER, {
    //     as: 'friends',
    //     through: 'USER_USER',
        // foreignKey: 'friend1',
        // otherKey: 'friend2'
    // }); // friends
    // USER.belongsToMany(USER, {
    //     as: 'friendsbis',
    //     through: 'USER_USER',
    //     foreignKey: 'friend2',
    //     otherKey: 'friend1'
    // }); // friends

    MESSAGE.hasMany(COMMENT);
    COMMENT.belongsTo(MESSAGE);
    COMMENT.belongsTo(USER);

    // COMMENT.hasMany(USER); // likes
    // MESSAGE.hasMany(USER); // likes
};
