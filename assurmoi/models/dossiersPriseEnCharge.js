const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DossiersPriseEnCharge extends Model {
    static associate(models) {
      DossiersPriseEnCharge.belongsTo(models.Sinistre, { foreignKey: 'sinistre_id', as: 'sinistre' });
      DossiersPriseEnCharge.belongsTo(models.Document, { foreignKey: 'rapport_expertise_id', as: 'rapportExpertise' });
      DossiersPriseEnCharge.belongsTo(models.Document, { foreignKey: 'facture_prestataire_id', as: 'facturePrestataire' });
      DossiersPriseEnCharge.belongsTo(models.Document, { foreignKey: 'rib_assure_id', as: 'ribAssure' });
    }
  }

  DossiersPriseEnCharge.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    num_dossier: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    sinistre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'INITIALISE',
        'EXPERTISE_EN_ATTENTE',
        'EXPERTISE_PLANIFIEE',
        'EXPERTISE_REALISEE',
        'INTERVENTION_A_PLANIFIER',
        'INTERVENTION_PLANIFIEE',
        'PRISE_EN_CHARGE_PLANIFIEE',
        'PRISE_EN_CHARGE_REALISEE',
        'INTERVENTION_EN_COURS',
        'RESTITUTION_A_PLANIFIER',
        'RESTITUTION_EN_COURS',
        'RESTITUE_ATTENTE_FACTURE',
        'FACTURE_RECUE',
        'REGLEMENT_REALISE',
        'ATTENTE_GARANTIE',
        'ATTENTE_REF_TIERS',
        'INDEMNISATION_ESTIMEE',
        'INDEMNISATION_VALIDEE',
        'INDEMNISATION_ATTENTE_REGLEMENT',
        'CLOS'
      ),
      defaultValue: 'INITIALISE'
    },
    scenario_type: {
      type: DataTypes.ENUM('REPARABLE', 'NON_REPARABLE'),
      allowNull: true
    },
    // Expertise
    date_expertise_planifiee: DataTypes.DATE,
    date_expertise_effective: DataTypes.DATE,
    date_retour_expertise: DataTypes.DATE,
    diagnostic_reparable: DataTypes.BOOLEAN,
    rapport_expertise_id: DataTypes.INTEGER,

    // Reparable
    date_intervention_planifiee: DataTypes.DATE,
    date_prise_en_charge_planifiee: DataTypes.DATE,
    date_prise_en_charge_effective: DataTypes.DATE,
    date_debut_intervention_effective: DataTypes.DATE,
    date_fin_intervention: DataTypes.DATE,
    date_restitution_planifiee: DataTypes.DATE,
    date_restitution_effective: DataTypes.DATE,
    date_reception_facture: DataTypes.DATE,
    facture_prestataire_id: DataTypes.INTEGER,
    date_reglement_prestataire: DataTypes.DATE,

    // Non Reparable
    montant_indemnisation_estime: DataTypes.DECIMAL(10, 2),
    approbation_client_indemnite: DataTypes.BOOLEAN,
    date_previsionnelle_prise_en_charge: DataTypes.DATE,
    rib_assure_id: DataTypes.INTEGER,
    date_indemnisation_reglee: DataTypes.DATE,

    // Common
    facture_tiers_reglee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_clos: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'DossiersPriseEnCharge',
    tableName: 'dossiers_prise_en_charge',
    timestamps: true
  });

  return DossiersPriseEnCharge;
};
