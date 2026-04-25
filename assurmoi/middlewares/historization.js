const { LogsAction } = require('../models');

/**
 * Middleware pour historiser les actions sur l'API
 */
const historize = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (content) {
        res.send = originalSend;
        
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
            const userId = req.user ? req.user.id : null;
            const entityType = req.baseUrl.replace('/', '').toUpperCase();
            
            let entityId = null;
            if (req.params.id) entityId = req.params.id;
            
            let responseData = {};
            try {
                responseData = JSON.parse(content);
                if (responseData.data && responseData.data.id) entityId = responseData.data.id;
            } catch (e) {}

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
