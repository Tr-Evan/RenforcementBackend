const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkflowStep extends Model {
    static associate(models) {
      WorkflowStep.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'current_step_id' });
    }
  }

  WorkflowStep.init({
    label: DataTypes.STRING,
    order_index: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WorkflowStep',
    tableName: 'workflow_steps',
    timestamps: false
  });

  return WorkflowStep;
};
