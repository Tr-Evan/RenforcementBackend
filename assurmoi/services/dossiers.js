const { DossiersPriseEnCharge, Sinistre, User, Document, History, dbInstance } = require('../models');

/**
 * Récupère tous les dossiers avec filtres de rôle
 */
exports.getAllDossiers = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'INSURED') {
      query = {
        include: [{
          model: Sinistre,
          as: 'sinistre',
          where: { assure_id: req.user.id }
        }]
      };
    } else {
      query = {
        include: [{ model: Sinistre, as: 'sinistre' }]
      };
    }

    const dossiers = await DossiersPriseEnCharge.findAll(query);
    res.json({ success: true, data: dossiers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Récupère un dossier par ID
 */
exports.getDossier = async (req, res) => {
  try {
    const dossier = await DossiersPriseEnCharge.findByPk(req.params.id, {
      include: [
        { model: Sinistre, as: 'sinistre' },
        { model: Document, as: 'rapportExpertise' },
        { model: Document, as: 'facturePrestataire' },
        { model: Document, as: 'ribAssure' }
      ]
    });
    if (!dossier) return res.status(404).json({ success: false, error: 'Dossier introuvable' });
    res.json({ success: true, data: dossier });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Passage à l'étape suivante du workflow
 */
exports.updateDossierStep = async (req, res) => {
  const transaction = await dbInstance.transaction();
  try {
    const { id } = req.params;
    const { next_status, data } = req.body; // data contient les champs à compléter pour l'étape

    const dossier = await DossiersPriseEnCharge.findByPk(id, {
      include: [{ model: Sinistre, as: 'sinistre' }]
    });

    if (!dossier) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Dossier introuvable' });
    }

    const oldStatus = dossier.status;
    const updatePayload = { status: next_status };

    // Logique de transition basée sur le sujet et les rôles
    const userRole = req.user.role;

    switch (next_status) {
      case 'EXPERTISE_PLANIFIEE':
        if (!['ADMIN', 'PORTFOLIO_MANAGER', 'FOLLOW_UP_OFFICER'].includes(userRole)) throw new Error('Action réservée aux gestionnaires');
        if (!data.date_expertise_planifiee) throw new Error('Date d\'expertise planifiée requise');
        updatePayload.date_expertise_planifiee = data.date_expertise_planifiee;
        break;

      case 'EXPERTISE_REALISEE':
        if (!['ADMIN', 'PORTFOLIO_MANAGER', 'FOLLOW_UP_OFFICER'].includes(userRole)) throw new Error('Action réservée aux gestionnaires');
        if (!data.date_expertise_effective) throw new Error('Date d\'expertise effective requise');
        updatePayload.date_expertise_effective = data.date_expertise_effective;
        break;

      case 'INTERVENTION_A_PLANIFIER':
      case 'INDEMNISATION_ESTIMEE':
        if (!['ADMIN', 'PORTFOLIO_MANAGER'].includes(userRole)) throw new Error('Seul un gestionnaire de portefeuille peut valider l\'expertise');
        if (!data.date_retour_expertise || data.diagnostic_reparable === undefined) {
          throw new Error('Date de retour et diagnostic requis');
        }
        updatePayload.date_retour_expertise = data.date_retour_expertise;
        updatePayload.diagnostic_reparable = data.diagnostic_reparable;
        updatePayload.scenario_type = data.diagnostic_reparable ? 'REPARABLE' : 'NON_REPARABLE';
        updatePayload.rapport_expertise_id = data.rapport_expertise_id;
        break;

      case 'INDEMNISATION_VALIDEE':
        if (userRole !== 'INSURED') throw new Error('Seul l\'assuré peut approuver l\'indemnisation');
        if (data.approbation_client_indemnite === undefined) throw new Error('Approbation client requise');
        updatePayload.approbation_client_indemnite = data.approbation_client_indemnite;
        break;

      case 'INDEMNISATION_ATTENTE_REGLEMENT':
        if (userRole !== 'INSURED') throw new Error('Seul l\'assuré peut fournir son RIB');
        if (!data.date_previsionnelle_prise_en_charge || !data.rib_assure_id) throw new Error('Date prévisionnelle et RIB requis');
        updatePayload.date_previsionnelle_prise_en_charge = data.date_previsionnelle_prise_en_charge;
        updatePayload.rib_assure_id = data.rib_assure_id;
        break;

      case 'REGLEMENT_REALISE':
        if (!['ADMIN', 'PORTFOLIO_MANAGER'].includes(userRole)) throw new Error('Action réservée aux gestionnaires');
        if (!data.date_reglement_prestataire && dossier.scenario_type === 'REPARABLE') throw new Error('Date de règlement requise');
        if (!data.date_indemnisation_reglee && dossier.scenario_type === 'NON_REPARABLE') throw new Error('Date d\'indemnisation requise');
        
        if (dossier.scenario_type === 'REPARABLE') updatePayload.date_reglement_prestataire = data.date_reglement_prestataire;
        else updatePayload.date_indemnisation_reglee = data.date_indemnisation_reglee;
        break;

      case 'CLOS':
        if (!['ADMIN', 'PORTFOLIO_MANAGER'].includes(userRole)) throw new Error('Action réservée aux gestionnaires');
        updatePayload.is_clos = true;
        break;

      default:
        // Pour les autres étapes du scénario 1
        if (!['ADMIN', 'PORTFOLIO_MANAGER', 'FOLLOW_UP_OFFICER'].includes(userRole)) throw new Error('Action réservée aux chargés de suivi');
    }

    await dossier.update(updatePayload, { transaction });

    await History.create({
      entity_type: 'DOSSIER',
      entity_id: dossier.id,
      action: 'STEP_CHANGE',
      user_id: req.user.id,
      action_date: new Date(),
      details: JSON.stringify({ from: oldStatus, to: next_status, data })
    }, { transaction });

    await transaction.commit();
    res.json({ success: true, data: dossier });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteDossier = async (req, res) => {
  try {
    const deleted = await DossiersPriseEnCharge.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, error: 'Dossier introuvable' });
    res.json({ success: true, message: 'Dossier supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
