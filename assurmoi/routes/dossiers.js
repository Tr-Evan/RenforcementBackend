const express = require('express');
const router = express.Router();
const { getAllDossiers, getDossier, createDossier, updateDossier, deleteDossier } = require('../services/dossiers');

router.get('/', getAllDossiers);
router.get('/:id', getDossier);
router.post('/', createDossier);
router.put('/:id', updateDossier);
router.delete('/:id', deleteDossier);

module.exports = router;
