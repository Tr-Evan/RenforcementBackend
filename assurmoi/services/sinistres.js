const { Sinistre } = require('../models');

exports.getAllSinistres = async (req, res) => {
  try {
    const sinistres = await Sinistre.findAll();
    res.json(sinistres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSinistre = async (req, res) => {
  try {
    const sinistre = await Sinistre.findByPk(req.params.id);
    if (!sinistre) return res.status(404).json({ error: 'Not found' });
    res.json(sinistre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSinistre = async (req, res) => {
  try {
    const sinistre = await Sinistre.create(req.body);
    res.status(201).json(sinistre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSinistre = async (req, res) => {
  try {
    const [updated] = await Sinistre.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSinistre = async (req, res) => {
  try {
    const deleted = await Sinistre.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
