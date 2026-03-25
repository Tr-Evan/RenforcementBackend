const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DossiersPriseEnCharge extends Model {
    static associate(models) {
      DossiersPriseEnCharge.belongsTo(models.Sinistre, { foreignKey: 'sinistre_id' });
      DossiersPriseEnCharge.belongsTo(models.WorkflowStep, { foreignKey: 'current_step_id' });
      DossiersPriseEnCharge.hasMany(models.Document, { foreignKey: 'dossier_id' });
    }
  }

  DossiersPriseEnCharge.init({
    num_dossier: DataTypes.STRING,
    sinistre_id: DataTypes.INTEGER,
    current_step_id: DataTypes.INTEGER,
    scenario_type: DataTypes.INTEGER,
    date_expertise_planifiee: DataTypes.DATEONLY,
    date_expertise_effective: DataTypes.DATEONLY,
    diagnostic_reparable: DataTypes.BOOLEAN,
    montant_indemnisation: DataTypes.DECIMAL(10, 2),
    approbation_client_indemnite: DataTypes.BOOLEAN,
    rib_client_joint: DataTypes.BOOLEAN,
    facture_tiers_reglee: DataTypes.BOOLEAN,
    is_clos: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'DossiersPriseEnCharge',
    tableName: 'dossiers_prise_en_charge',
    timestamps: false
  });

  return DossiersPriseEnCharge;
};
