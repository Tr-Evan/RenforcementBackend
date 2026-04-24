const userRoutes = require('./users')
const sinistreRoutes = require('./sinistres')
const dossierRoutes = require('./dossiers')
const documentRoutes = require('./documents')
const historiesRoutes = require('./histories')
const authRoutes = require('./auth')
const rgpdRoutes = require('./rgpd')

function initRoutes(app){
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes)
    app.use('/sinistres', sinistreRoutes)
    app.use('/dossiers', dossierRoutes)
    app.use('/documents', documentRoutes)
    app.use('/histories', historiesRoutes)
    app.use('/rgpd', rgpdRoutes)
    
    app.get('/', (req, res) => {
        res.status(200).json({
            message: "Bienvenue sur l'API AssurMoi"
        })
    })
}

module.exports = initRoutes