exports.joinTables = (sequelize) => {
    // console.log('MODELS', sequelize.models);
    const { USER, MESSAGE, COMMENT } = sequelize.models;

    USER.hasMany(MESSAGE);
    MESSAGE.belongsTo(USER);

    USER.belongsToMany(USER, {
        as: 'friends',
        through: 'USER_USER',
        foreignKey: 'friend1',
        otherKey: 'friend2'
    }); // friends

    MESSAGE.hasMany(COMMENT);
    COMMENT.belongsTo(MESSAGE);
    COMMENT.belongsTo(USER);

    // COMMENT.hasMany(USER); // likes
    // MESSAGE.hasMany(USER); // likes
};
