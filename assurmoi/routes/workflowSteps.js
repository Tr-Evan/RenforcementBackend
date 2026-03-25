const express = require('express');
const router = express.Router();
const { getAllWorkflowSteps, getWorkflowStep, createWorkflowStep, updateWorkflowStep, deleteWorkflowStep } = require('../services/workflowSteps');

router.get('/', getAllWorkflowSteps);
router.get('/:id', getWorkflowStep);
router.post('/', createWorkflowStep);
router.put('/:id', updateWorkflowStep);
router.delete('/:id', deleteWorkflowStep);

module.exports = router;
