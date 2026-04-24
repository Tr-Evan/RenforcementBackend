const { Sinistre, User, Document, History, DossiersPriseEnCharge, dbInstance } = require('../models');
const { sendMailDocumentsRequested } = require('../utils/mailer');
const { Op } = require('sequelize');

/**
 * Récupère tous les sinistres selon le rôle de l'utilisateur
 */
const getAllSinistres = async (req, res) => {
  try {
    let query = {};
    
    // Filtrer selon le rôle
    if (req.user.role === 'CUSTOMER_SERVICE_OFFICER') {
      query.where = { created_by_id: req.user.id };
    } else if (req.user.role === 'INSURED') {
      query.where = { assure_id: req.user.id };
    }
    // ADMIN et PORTFOLIO_MANAGER voient tous les sinistres

    const sinistres = await Sinistre.findAll({
      ...query,
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'username', 'firstname', 'lastname'] },
        { model: User, as: 'Assure', attributes: ['id', 'username', 'firstname', 'lastname', 'email'] },
        { model: Document, attributes: ['id', 'document_type', 'file_path', 'validation_status'] }
      ],
      order: [['date_accident', 'DESC']]
    });

    res.json({ success: true, data: sinistres });
  } catch (err) {
    console.error('Error fetching sinistres:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Récupère un sinistre spécifique
 */
const getSinistre = async (req, res) => {
  try {
    const { id } = req.params;
    const sinistre = await Sinistre.findByPk(id, {
      include: [
        { model: User, as: 'Creator', attributes: ['id', 'username', 'firstname', 'lastname'] },
        { model: User, as: 'Assure', attributes: ['id', 'username', 'firstname', 'lastname', 'email'] },
        { model: Document },
        { model: DossiersPriseEnCharge }
      ]
    });

    if (!sinistre) {
      return res.status(404).json({ success: false, error: 'Sinistre not found' });
    }

    // Vérifier les permissions
    if (req.user.role === 'INSURED' && sinistre.assure_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, data: sinistre });
  } catch (err) {
    console.error('Error fetching sinistre:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Crée un nouveau sinistre
 * Rôles autorisés: ADMIN, PORTFOLIO_MANAGER, CUSTOMER_SERVICE_OFFICER
 */
const createSinistre = async (req, res) => {
  const transaction = await dbInstance.transaction();
  
  try {
    const {
      immatriculation,
      conducteur_nom,
      conducteur_prenom,
      is_conducteur_assure,
      date_appel,
      date_accident,
      contexte,
      responsabilite_pourcentage,
      assure_id
    } = req.body;

    // Validations
    if (!immatriculation || !conducteur_nom || !conducteur_prenom) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: immatriculation, conducteur_nom, conducteur_prenom' 
      });
    }

    if (!assure_id) {
      return res.status(400).json({ success: false, error: 'assure_id is required' });
    }

    // Vérifier que l'assuré existe
    const assure = await User.findByPk(assure_id);
    if (!assure) {
      return res.status(404).json({ success: false, error: 'Assure user not found' });
    }

    // Générer une référence de sinistre unique
    const reference = `SIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Gérer la responsabilité
    let responsabilite = responsabilite_pourcentage;
    if (responsabilite === false || responsabilite === 0 || responsabilite === null) {
      responsabilite = 0;
    } else if (responsabilite === true) {
      responsabilite = 100;
    } else {
      responsabilite = Math.max(0, Math.min(100, parseInt(responsabilite)));
    }

    const sinistre = await Sinistre.create({
      reference,
      immatriculation,
      conducteur_nom,
      conducteur_prenom,
      is_conducteur_assure: is_conducteur_assure || false,
      date_appel: date_appel || new Date(),
      date_accident,
      contexte,
      responsabilite_pourcentage: responsabilite,
      status_validation: 'EN_ATTENTE_VALIDATION',
      created_by_id: req.user.id,
      assure_id
    }, { transaction });

    // Enregistrer l'action dans l'historique
    await History.create({
      entity_type: 'SINISTRE',
      entity_id: sinistre.id,
      action: 'CREATE',
      user_id: req.user.id,
      action_date: new Date(),
      details: JSON.stringify({ sinistre: sinistre.dataValues })
    }, { transaction });

    await transaction.commit();

    // Envoyer une notification à l'assuré
    await sendMailDocumentsRequested(assure, {
      type: 'SINISTRE_CREATED',
      reference: sinistre.reference
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({ 
      success: true, 
      data: sinistre,
      message: 'Sinistre created successfully'
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error creating sinistre:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Met à jour un sinistre
 */
const updateSinistre = async (req, res) => {
  const transaction = await dbInstance.transaction();

  try {
    const { id } = req.params;
    const sinistre = await Sinistre.findByPk(id);

    if (!sinistre) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Sinistre not found' });
    }

    // Vérifier les permissions
    if (req.user.role === 'CUSTOMER_SERVICE_OFFICER' && sinistre.created_by_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const updatedData = { ...req.body };
    
    // Gérer la responsabilité
    if (updatedData.responsabilite_pourcentage !== undefined) {
      if (updatedData.responsabilite_pourcentage === false || updatedData.responsabilite_pourcentage === 0) {
        updatedData.responsabilite_pourcentage = 0;
      } else if (updatedData.responsabilite_pourcentage === true) {
        updatedData.responsabilite_pourcentage = 100;
      } else {
        updatedData.responsabilite_pourcentage = Math.max(0, Math.min(100, parseInt(updatedData.responsabilite_pourcentage)));
      }
    }

    const oldData = sinistre.dataValues;
    await sinistre.update(updatedData, { transaction });

    // Enregistrer l'action dans l'historique
    await History.create({
      entity_type: 'SINISTRE',
      entity_id: sinistre.id,
      action: 'UPDATE',
      user_id: req.user.id,
      action_date: new Date(),
      details: JSON.stringify({ before: oldData, after: sinistre.dataValues })
    }, { transaction });

    await transaction.commit();

    res.json({ 
      success: true, 
      data: sinistre,
      message: 'Sinistre updated successfully'
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error updating sinistre:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Valide un sinistre (PORTFOLIO_MANAGER ou ADMIN uniquement)
 */
const validateSinistre = async (req, res) => {
  const transaction = await dbInstance.transaction();

  try {
    const { id } = req.params;
    const { status_validation } = req.body;

    if (!['VALIDÉ', 'REJETÉ'].includes(status_validation)) {
      return res.status(400).json({ 
        success: false, 
        error: 'status_validation must be VALIDÉ or REJETÉ' 
      });
    }

    const sinistre = await Sinistre.findByPk(id, { transaction });

    if (!sinistre) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Sinistre not found' });
    }

    await sinistre.update({ status_validation }, { transaction });

    // Si validé, créer automatiquement un dossier de prise en charge
    if (status_validation === 'VALIDÉ') {
      const numDossier = `DOS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await DossiersPriseEnCharge.create({
        num_dossier: numDossier,
        sinistre_id: sinistre.id,
        current_step_id: 1, // Étape initiale
        scenario_type: null,
        is_clos: false
      }, { transaction });
    }

    // Enregistrer l'action dans l'historique
    await History.create({
      entity_type: 'SINISTRE',
      entity_id: sinistre.id,
      action: 'VALIDATE',
      user_id: req.user.id,
      action_date: new Date(),
      details: JSON.stringify({ new_status: status_validation })
    }, { transaction });

    await transaction.commit();

    // Notifier l'assuré
    const assure = await User.findByPk(sinistre.assure_id);
    if (assure) {
      await sendMailDocumentsRequested(assure, {
        type: 'SINISTRE_' + status_validation,
        reference: sinistre.reference
      }).catch(err => console.error('Email error:', err));
    }

    res.json({ 
      success: true, 
      data: sinistre,
      message: `Sinistre ${status_validation.toLowerCase()}`
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error validating sinistre:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Supprime un sinistre
 */
const deleteSinistre = async (req, res) => {
  const transaction = await dbInstance.transaction();

  try {
    const { id } = req.params;
    const sinistre = await Sinistre.findByPk(id, { transaction });

    if (!sinistre) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Sinistre not found' });
    }

    const numDossiers = await DossiersPriseEnCharge.count({ where: { sinistre_id: id } });
    if (numDossiers > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete sinistre with active dossiers' 
      });
    }

    // Enregistrer l'action avant suppression
    await History.create({
      entity_type: 'SINISTRE',
      entity_id: sinistre.id,
      action: 'DELETE',
      user_id: req.user.id,
      action_date: new Date(),
      details: JSON.stringify({ deleted_data: sinistre.dataValues })
    }, { transaction });

    await sinistre.destroy({ transaction });

    await transaction.commit();

    res.json({ 
      success: true,
      message: 'Sinistre deleted successfully'
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error deleting sinistre:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllSinistres,
  getSinistre,
  createSinistre,
  updateSinistre,
  validateSinistre,
  deleteSinistre
};
