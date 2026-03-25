const { WorkflowStep } = require('../models');

exports.getAllWorkflowSteps = async (req, res) => {
  try {
    const steps = await WorkflowStep.findAll();
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkflowStep = async (req, res) => {
  try {
    const step = await WorkflowStep.findByPk(req.params.id);
    if (!step) return res.status(404).json({ error: 'Not found' });
    res.json(step);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createWorkflowStep = async (req, res) => {
  try {
    const step = await WorkflowStep.create(req.body);
    res.status(201).json(step);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorkflowStep = async (req, res) => {
  try {
    const [updated] = await WorkflowStep.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWorkflowStep = async (req, res) => {
  try {
    const deleted = await WorkflowStep.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
