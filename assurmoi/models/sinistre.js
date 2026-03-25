const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sinistre extends Model {
    static associate(models) {
      Sinistre.belongsTo(models.User, { as: 'Creator', foreignKey: 'created_by_id' });
      Sinistre.belongsTo(models.User, { as: 'Assure', foreignKey: 'assure_id' });
      Sinistre.hasMany(models.DossiersPriseEnCharge, { foreignKey: 'sinistre_id' });
      Sinistre.hasMany(models.Document, { foreignKey: 'sinistre_id' });
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
    status_validation: DataTypes.STRING,
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
