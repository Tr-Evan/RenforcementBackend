const userRoutes = require('./users');

function initRoutes(app) {
    // déclaration des routes par métiers
    app.use('/user', userRoutes);

    app.get('/', (req, res) => {
        // middleware
        console.log('middleware 1 homepage');
        next();
    }, (req, res, next) => {
        // controller
        console.log('controller homepage');
        res.status(200).json({ 
            message: 'Bienvenue sur la homepage!' 
        });
    });
}

module.exports = initRoutes;