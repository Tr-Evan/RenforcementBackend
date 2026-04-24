/**
 * Middleware pour vérifier les rôles des utilisateurs
 * Utilisation: app.use('/admin', checkRole('ADMIN'), adminRoutes)
 */

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!rolesArray.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${rolesArray.join(', ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

module.exports = { checkRole };
