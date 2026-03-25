const express = require('express');
const router = express.Router();
const { getAllRoles, getRole, createRole, updateRole, deleteRole } = require('../services/roles');

router.get('/', getAllRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
