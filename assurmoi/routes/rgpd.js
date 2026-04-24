const express = require("express");
const router = express.Router();
const rgpdService = require('../services/rgpd');
const { validationAuthentification } = require('../middlewares/auth');

router.get("/export", validationAuthentification, rgpdService.exportUserData);
router.post("/delete-account", validationAuthentification, rgpdService.deleteAccount);

module.exports = router;
