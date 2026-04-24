const { Sinistre, User, DossiersPriseEnCharge, Document } = require('../models');

/**
 * Service pour les fonctionnalités RGPD
 */
exports.exportUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findByPk(userId, {
            include: [
                { 
                    model: Sinistre, 
                    as: 'sinistres', 
                    where: { assure_id: userId },
                    required: false,
                    include: [{ model: DossiersPriseEnCharge, as: 'dossiers' }]
                }
            ]
        });

        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // On nettoie les données sensibles avant l'export
        const exportData = {
            profile: user.clean(),
            sinistres: user.sinistres || []
        };

        res.json({
            success: true,
            data: exportData,
            message: "Vos données personnelles ont été exportées avec succès conformément au RGPD."
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    // Dans une vraie application, on anonymiserait plutôt que de supprimer
    // pour garder les traces comptables/assurances
    try {
        const user = await User.findByPk(req.user.id);
        await user.update({ active: false, email: `deleted_${Date.now()}@assurmoi.fr`, username: `deleted_${Date.now()}` });
        res.json({ success: true, message: "Votre compte a été désactivé et vos données personnelles anonymisées." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
