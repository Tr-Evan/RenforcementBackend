const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'role_id' });
    }
  }

  Role.init({
    label: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false
  });

  return Role;
};
