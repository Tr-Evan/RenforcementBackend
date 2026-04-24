const express = require('express');
const router = express.Router();
const { validationAuthentification } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const siniestreService = require('../services/sinistres');

// Toutes les routes nécessitent une authentification
router.use(validationAuthentification);

// Récupérer tous les sinistres
router.get('/', siniestreService.getAllSinistres);

// Récupérer un sinistre spécifique
router.get('/:id', siniestreService.getSinistre);

// Créer un nouveau sinistre (rôles spécifiques)
router.post('/', checkRole(['ADMIN', 'PORTFOLIO_MANAGER', 'CUSTOMER_SERVICE_OFFICER']), siniestreService.createSinistre);

// Mettre à jour un sinistre
router.put('/:id', checkRole(['ADMIN', 'PORTFOLIO_MANAGER', 'CUSTOMER_SERVICE_OFFICER']), siniestreService.updateSinistre);

// Valider un sinistre (PORTFOLIO_MANAGER ou ADMIN)
router.post('/:id/validate', checkRole(['ADMIN', 'PORTFOLIO_MANAGER']), siniestreService.validateSinistre);

// Supprimer un sinistre
router.delete('/:id', checkRole(['ADMIN']), siniestreService.deleteSinistre);

module.exports = router;
