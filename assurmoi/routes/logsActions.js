const express = require('express');
const router = express.Router();
const { getAllLogsActions, getLogsAction, createLogsAction, updateLogsAction, deleteLogsAction } = require('../services/logsActions');

router.get('/', getAllLogsActions);
router.get('/:id', getLogsAction);
router.post('/', createLogsAction);
router.put('/:id', updateLogsAction);
router.delete('/:id', deleteLogsAction);

module.exports = router;
