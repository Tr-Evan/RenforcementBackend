const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role_id' });
      User.hasMany(models.LogsAction, { foreignKey: 'user_id' });
      User.hasMany(models.Sinistre, { as: 'CreatedSinistres', foreignKey: 'created_by_id' });
      User.hasMany(models.Sinistre, { as: 'AssureSinistres', foreignKey: 'assure_id' });
      User.hasMany(models.Document, { foreignKey: 'validated_by_id' });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    two_factor_secret: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });

  return User;
};