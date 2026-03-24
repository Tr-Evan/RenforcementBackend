const { Model, DataTypes } = require('sequelize');
const { dbInstance } = require('.');

const User = (Sequelize, DataTypes) => {
    class User extends Model {
        // static associate(models) {
        //     this.belongsTo(models.Person, {
        //         foreignKey: 'personId',
        //         as: 'person'
        //     })
        // }
    }
    
    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: DataTypes.STRING
        },
        {
            sequelize: dbInstance,
            modelName: 'User'
        }
    )

    return User;
}

module.exports = User