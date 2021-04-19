const { Model, DataTypes } = require('sequelize');

class USER extends Model {}

exports.userModel = (sequelize) => {
    USER.init(
        {
            lastname: DataTypes.STRING,
            firstname: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING
        },
        { sequelize }
    );
    return USER;
};