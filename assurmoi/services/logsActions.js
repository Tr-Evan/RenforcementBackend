const { LogsAction } = require('../models');

exports.getAllLogsActions = async (req, res) => {
  try {
    const logs = await LogsAction.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogsAction = async (req, res) => {
  try {
    const log = await LogsAction.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLogsAction = async (req, res) => {
  try {
    const log = await LogsAction.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLogsAction = async (req, res) => {
  try {
    const [updated] = await LogsAction.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLogsAction = async (req, res) => {
  try {
    const deleted = await LogsAction.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
