const express = require("express");
const router = express.Router();

const { login, verify2FA, requestPasswordReset, resetPassword, logout } = require('../services/auth')
const { validationAuthentification } = require('../middlewares/auth')

router.post('/login', login)
router.post('/verify-2fa', verify2FA)
router.post('/request-password-reset', requestPasswordReset)
router.post('/reset-password', resetPassword)
router.post('/logout', validationAuthentification, logout);

module.exports = router