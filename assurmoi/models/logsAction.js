const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LogsAction extends Model {
    static associate(models) {
      LogsAction.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  LogsAction.init({
    entity_type: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    action_description: DataTypes.TEXT,
    old_status: DataTypes.STRING,
    new_status: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'LogsAction',
    tableName: 'logs_actions',
    timestamps: false
  });

  return LogsAction;
};
