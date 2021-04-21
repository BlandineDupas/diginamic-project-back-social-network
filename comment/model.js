const { Model, DataTypes } = require('sequelize');

class COMMENT extends Model {}

exports.commentModel = (sequelize) => {
    COMMENT.init(
        {
            content: DataTypes.TEXT,
        },
        { sequelize }
    );
    return COMMENT;
};