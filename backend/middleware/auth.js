
const jwt = require('jsonwebtoken');
const User = require('../ORM/user.model.js');

// Define auth middleware function
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header and remove "Bearer " prefix
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify token and get decoded data (user_id)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database based on user_id in token
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    // If user doesn't exist, throw an error
    if (!user) {
      throw new Error();
    }

    // Add user and token to request object for later use
    req.user = user;
    req.token = token;
    
    // Call next middleware function
    next();
  } catch (error) {
    // If authentication fails, send error response
    res.status(401).send({ error: 'Authentication failed' });
  }
};

// Export auth middleware function
module.exports = auth;
