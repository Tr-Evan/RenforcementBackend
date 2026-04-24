const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sinistre extends Model {
    static associate(models) {
      Sinistre.belongsTo(models.User, { as: 'Creator', foreignKey: 'created_by_id' });
      Sinistre.belongsTo(models.User, { as: 'Assure', foreignKey: 'assure_id' });
      Sinistre.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'sinistre_id', as: 'dossiers' });
      Sinistre.belongsTo(models.Document, { foreignKey: 'cni_driver_id', as: 'cniDocument' });
      Sinistre.belongsTo(models.Document, { foreignKey: 'carte_grise_id', as: 'carteGriseDocument' });
      Sinistre.belongsTo(models.Document, { foreignKey: 'attestation_assurance_id', as: 'attestationDocument' });
    }
  }

  Sinistre.init({
    reference: DataTypes.STRING,
    immatriculation: DataTypes.STRING,
    conducteur_nom: DataTypes.STRING,
    conducteur_prenom: DataTypes.STRING,
    is_conducteur_assure: DataTypes.BOOLEAN,
    date_appel: DataTypes.DATE,
    date_accident: DataTypes.DATE,
    contexte: DataTypes.TEXT,
    responsabilite_pourcentage: DataTypes.INTEGER,
    status_validation: {
      type: DataTypes.ENUM('BROUILLON', 'EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE'),
      defaultValue: 'BROUILLON'
    },
    cni_driver_id: DataTypes.INTEGER,
    carte_grise_id: DataTypes.INTEGER,
    attestation_assurance_id: DataTypes.INTEGER,
    created_by_id: DataTypes.INTEGER,
    assure_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sinistre',
    tableName: 'sinistres',
    timestamps: false
  });

  return Sinistre;
};
