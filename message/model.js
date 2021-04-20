const { Model, DataTypes } = require('sequelize');

class MESSAGE extends Model {}

exports.messageModel = (sequelize) => {
    MESSAGE.init(
        {
            content: DataTypes.TEXT,
            authorId: DataTypes.INTEGER,
        },
        { sequelize }
    );
    return MESSAGE;
};