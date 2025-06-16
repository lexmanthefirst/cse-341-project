const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  authorizeRoles,
};
// exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') return next();
//   res.status(403).json({ message: 'Access denied' });
// };
// exports.isUser = (req, res, next) => {
//   if (req.user && req.user.role === 'user') return next();
//   res.status(403).json({ message: 'Access denied' });
// };
