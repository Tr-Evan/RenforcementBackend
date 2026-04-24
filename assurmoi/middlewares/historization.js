const { LogsAction } = require('../models');

/**
 * Middleware pour historiser les actions sur l'API
 */
const historize = async (req, res, next) => {
    // On intercepte la réponse pour enregistrer l'action si elle a réussi
    const originalSend = res.send;

    res.send = function (content) {
        res.send = originalSend;
        
        // On ne log que les méthodes qui modifient les données et les succès (2xx)
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
            const userId = req.user ? req.user.id : null;
            const entityType = req.baseUrl.replace('/', '').toUpperCase();
            
            // Extraction de l'ID de l'entité si possible
            let entityId = null;
            if (req.params.id) entityId = req.params.id;
            
            // On parse le contenu pour récupérer des infos si c'est du JSON
            let responseData = {};
            try {
                responseData = JSON.parse(content);
                if (responseData.data && responseData.data.id) entityId = responseData.data.id;
            } catch (e) {}

            // Création du log en arrière-plan
            LogsAction.create({
                entity_type: entityType,
                entity_id: entityId,
                user_id: userId,
                action_description: `${req.method} ${req.originalUrl}`,
                new_status: responseData.data ? responseData.data.status : null,
                created_at: new Date()
            }).catch(err => console.error('Error creating log:', err));
        }

        return res.send(content);
    };

    next();
};

module.exports = { historize };
