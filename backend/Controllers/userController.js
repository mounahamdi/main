const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../ORM/user.model.js');

async function registerUser(req, res) {
  try {
    const { user_name, email, password } = req.body;

    // Validate input
    if (!user_name || !email || !password) {
      return res.status(400).json({ message: 'Please provide user_name, email, and password' });
    }

    if (typeof user_name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Name, email, and password must be strings' });
    }

    if (user_name.length < 3) {
      return res.status(400).json({ message: 'Name must be at least 3 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email address already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({ user_name, email, password: hashedPassword});

    // Generate JWT token
    const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET);

    // Send response with token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email and password must be strings' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET);

    // Send response with token
    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update user info : 
async function updateUser(req, res) {
    try {
      const { user_id } = req.params;
      const { user_name, email, password, phone, address, city, state, zip_code, country} = req.body;
  
      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user
      user.user_name = user_name || user.user_name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.city = city || user.city;
      user.state = state || user.state;
      user.zip_code = zip_code || user.zip_code;
      user.country = country || user.country;
     
    
  
      // Check if password needs to be updated
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


// Delete a User : 
async function deleteUser(req, res) {
    try {
      const { user_id } = req.params;
  
      // Validate input
      if (!user_id) {
        return res.status(400).json({ message: 'Please provide a user id' });
      }
  
      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete user
      await user.destroy();
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


// Get user's info by ID:   
async function getUserById(req, res) {
    try {
      const { user_id } = req.params;
  
      // Validate input
      if (!user_id) {
        return res.status(400).json({ message: 'Please provide a user id' });
      }
  
      // Check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
   

  // Retrieves all users 
  async function getUsers(req, res) {
    try {
      // Get all users from the database
      const users = await User.findAll();
  
      // Send response with users data
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    

module.exports = {
  registerUser,
  loginUser,
  updateUser, 
  deleteUser,
  getUserById,
  getUsers
};

