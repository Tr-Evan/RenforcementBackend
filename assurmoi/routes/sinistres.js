const express = require('express');
const router = express.Router();
const { validationAuthentification } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');
const siniestreService = require('../services/sinistres');

// Authentification requise pour toutes les routes
router.use(validationAuthentification);

// Get all sinistres
router.get('/', siniestreService.getAllSinistres);

// Get sinistre by ID
router.get('/:id', siniestreService.getSinistre);

// Créer un nouveau sinistre
router.post('/', checkRole(['ADMIN', 'PORTFOLIO_MANAGER', 'CUSTOMER_SERVICE_OFFICER']), siniestreService.createSinistre);

// Mettre à jour un sinistre
router.put('/:id', checkRole(['ADMIN', 'PORTFOLIO_MANAGER', 'CUSTOMER_SERVICE_OFFICER']), siniestreService.updateSinistre);

// Valider un sinistre 
router.post('/:id/validate', checkRole(['ADMIN', 'PORTFOLIO_MANAGER']), siniestreService.validateSinistre);

// Supprimer un sinistre
router.delete('/:id', checkRole(['ADMIN']), siniestreService.deleteSinistre);

module.exports = router;
