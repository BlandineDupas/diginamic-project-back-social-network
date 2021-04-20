exports.joinTables = (sequelize) => {
    console.log('MODELS', sequelize.models);
    const { USER, MESSAGE } = sequelize.models;

    USER.hasMany(MESSAGE);
    MESSAGE.belongsTo(USER);
};
