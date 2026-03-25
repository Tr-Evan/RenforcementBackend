const userRoutes = require('./users');
const roleRoutes = require('./roles');
const sinistreRoutes = require('./sinistres');
const dossierRoutes = require('./dossiers');
const workflowStepRoutes = require('./workflowSteps');
const documentRoutes = require('./documents');
const logsActionRoutes = require('./logsActions');

function initRoutes(app) {
    app.use('/users', userRoutes);
    app.use('/roles', roleRoutes);
    app.use('/sinistres', sinistreRoutes);
    app.use('/dossiers', dossierRoutes);
    app.use('/workflow-steps', workflowStepRoutes);
    app.use('/documents', documentRoutes);
    app.use('/logs-actions', logsActionRoutes);

    app.get('/', (req, res, next) => {
        console.log('middleware Homepage');
        next();
    }, (req, res, next) => {
        console.log('Controller Homepage');
        res.status(200).json({
            message: "Bienvenu sur la page d'accueil"
        });
    });
}

module.exports = initRoutes;