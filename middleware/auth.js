/**
 * Require a logged-in session with the given role.
 * Usage: router.get('/dashboard', requireRole('student'), handler)
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.redirect('/login');
    }
    next();
  };
}

// Makes the logged-in user (or null) available to every EJS view as `currentUser`.
function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
}

module.exports = { requireRole, attachUser };
