exports.joinTables = (sequelize) => {
    console.log('MODELS', sequelize.models);
    const { USER, MESSAGE, COMMENT } = sequelize.models;

    USER.hasMany(MESSAGE);
    MESSAGE.belongsTo(USER);

    USER.belongsToMany(USER, {as: 'Friends', through: 'User_User'}); // friends

    MESSAGE.hasMany(COMMENT);
    COMMENT.belongsTo(MESSAGE);
    COMMENT.belongsTo(USER);

    // COMMENT.hasMany(USER); // likes
    // MESSAGE.hasMany(USER); // likes
};
