const express = require("express");
const router = express.Router();
const dossiersService = require('../services/dossiers');
const { validationAuthentification } = require('../middlewares/auth');

router.get("/", validationAuthentification, dossiersService.getAllDossiers);
router.get("/:id", validationAuthentification, dossiersService.getDossier);
router.patch("/:id/step", validationAuthentification, dossiersService.updateDossierStep);
router.delete("/:id", validationAuthentification, dossiersService.deleteDossier);

module.exports = router;
