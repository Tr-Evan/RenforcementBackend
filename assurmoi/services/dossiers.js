const { DossiersPriseEnCharge } = require('../models');

exports.getAllDossiers = async (req, res) => {
  try {
    const dossiers = await DossiersPriseEnCharge.findAll();
    res.json(dossiers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDossier = async (req, res) => {
  try {
    const dossier = await DossiersPriseEnCharge.findByPk(req.params.id);
    if (!dossier) return res.status(404).json({ error: 'Not found' });
    res.json(dossier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDossier = async (req, res) => {
  try {
    const dossier = await DossiersPriseEnCharge.create(req.body);
    res.status(201).json(dossier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDossier = async (req, res) => {
  try {
    const [updated] = await DossiersPriseEnCharge.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDossier = async (req, res) => {
  try {
    const deleted = await DossiersPriseEnCharge.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
