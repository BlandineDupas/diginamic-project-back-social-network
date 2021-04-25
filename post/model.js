const { Model, DataTypes } = require('sequelize');

class POST extends Model {}

exports.postModel = (sequelize) => {
    POST.init(
        {
            content: DataTypes.TEXT,
        },
        { sequelize }
    );
    return POST;
};