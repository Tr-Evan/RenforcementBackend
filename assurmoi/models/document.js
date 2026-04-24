const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      Document.hasMany(models.Sinistre, { foreignKey: 'cni_driver_id', as: 'sinistresCni' });
      Document.hasMany(models.Sinistre, { foreignKey: 'carte_grise_id', as: 'sinistresCarteGrise' });
      Document.hasMany(models.Sinistre, { foreignKey: 'attestation_assurance_id', as: 'sinistresAttestation' });
      Document.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'rapport_expertise_id', as: 'dossiersExpertise' });
      Document.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'facture_prestataire_id', as: 'dossiersFacture' });
      Document.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'rib_assure_id', as: 'dossiersRib' });
    }
  }

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('CNI', 'REGISTRATION', 'INSURANCE', 'REPORT', 'INVOICE', 'RIB', 'OTHER'),
        allowNull: false,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'document',
      timestamps: false,
    }
  );

  return Document;
};
