const isAdmin = (req, res, next) => {
    // Check if user is an admin
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ error: 'Unauthorized access' });
    }
  };
  
  module.exports = isAdmin;