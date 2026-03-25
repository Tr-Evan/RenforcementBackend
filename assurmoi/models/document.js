const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.Sinistre, { foreignKey: 'sinistre_id' });
      Document.belongsTo(models.DossiersPriseEnCharge, { foreignKey: 'dossier_id' });
      Document.belongsTo(models.User, { foreignKey: 'validated_by_id' });
    }
  }

  Document.init({
    sinistre_id: DataTypes.INTEGER,
    dossier_id: DataTypes.INTEGER,
    type_document: DataTypes.STRING,
    url_storage: DataTypes.STRING,
    is_validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    validated_by_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: false
  });

  return Document;
};
