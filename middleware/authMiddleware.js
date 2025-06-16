exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authenticated' });
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
// exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') return next();
//   res.status(403).json({ message: 'Access denied' });
// };
// exports.isUser = (req, res, next) => {
//   if (req.user && req.user.role === 'user') return next();
//   res.status(403).json({ message: 'Access denied' });
// };
